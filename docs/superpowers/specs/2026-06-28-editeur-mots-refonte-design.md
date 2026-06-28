# Refonte de l'éditeur de mots (⚙️ Réglages des mots)

Date : 2026-06-28
Statut : approuvé (design), à implémenter

## Contexte

L'éditeur de mots (`src/screens/WordEditor.jsx`), ouvert via ⚙️ depuis
l'accueil, affiche actuellement **une carte par mot** (poignée de glissement,
flèches ▲▼, champ `mot`, case 🔥 Nether, 🗑 supprimer, aperçu syllabes, champ
indice). Avec ~170 mots par défaut, l'empilement de cartes est lourd et
difficile à parcourir.

Flux de configuration actuel :
`loadConfig()` (une fois au démarrage de `App`) → `entrees`
`[{ mot, indice, nether }]` → `prepareList()` → `motsListe` consommé par le jeu.
La validation de l'éditeur appelle `saveConfig()` (clé localStorage
`motsblocs-config-v1`).

Limites visées par cette refonte :
1. Lisibilité : passer d'un empilement de cartes à un **tableau** (1 ligne = 1 mot).
2. Le bouton « ↺ Réinitialiser » actuel ne fait que recharger les défauts dans
   l'état local de l'éditeur ; on veut un **Reset** explicite et confirmé.
3. Pas de moyen de **mettre un mot de côté** sans le supprimer.

## Objectifs

- Refonte visuelle de l'éditeur en tableau, plus facile à administrer.
- Bouton **Reset** qui remet la liste par défaut de `words.js` (effectif au Valider).
- Possibilité de **désactiver / réactiver** un mot (le garder sans qu'il
  apparaisse dans le jeu).

Hors périmètre : tout autre changement de l'éditeur ou du jeu non listé ici.

## Décisions (validées avec l'utilisateur)

- **Reset différé** : le clic Reset (avec confirmation) recharge la liste par
  défaut dans l'éditeur seulement. Rien n'est persisté tant qu'on ne clique pas
  Valider. Annuler conserve la liste actuelle.
- **Désactivés réactivables, exclus du jeu ET du Nether** : un mot mis de côté
  descend dans une 2ᵉ liste « Mots de côté » et n'apparaît ni dans le jeu normal
  ni dans l'épreuve Nether tant qu'il est désactivé.
- **Disposition** : tableau complet avec l'indice toujours visible (responsive :
  colonne indice rétrécie / léger scroll horizontal sur petit écran).

## Conception

### 1. Modèle de données

Ajout d'un unique champ `actif` (booléen) à chaque entrée :
`{ mot, indice, nether, actif }`.

- `src/config.js → toEntry(m)` : ajouter `actif: m.actif !== false` (défaut
  **vrai**). Ainsi, toute entrée existante (chaîne, ou objet sans `actif`) est
  considérée active → rétrocompatible avec les configs déjà en localStorage et
  avec `words.js`.
- `src/config.js → saveConfig` : inclure `actif` dans l'objet « propre »
  persisté : `{ mot, indice, nether, actif }`.
- `defaultMots()` : inchangé dans sa forme (passe par `toEntry`, donc `actif`
  vaut `true` partout).

`src/wordList.js` (`normaliser`, `decouperAuto`, `prepareList`) n'est **pas**
modifié : le filtrage des inactifs se fait en amont, dans `App`.

### 2. Câblage du jeu (`src/App.jsx`)

Changement unique sur le calcul de la liste jouée :

```js
const motsListe = useMemo(
  () => prepareList(entrees.filter((e) => e.actif !== false)),
  [entrees]
);
```

Conséquences (sans autre changement) :
- `motsNether = motsListe.filter(m => m.nether)` ne contient que des mots actifs.
- `wordCount` (= `motsListe.length`) sur l'accueil ne compte que les actifs.
- `App` continue de passer **toutes** les `entrees` (actives + inactives) à
  l'éditeur, qui a besoin des inactives pour la section « Mots de côté ».
  `onValidate` renvoie toutes les entrées, inactives comprises.

### 3. Éditeur en tableau (`src/screens/WordEditor.jsx`)

État interne : un seul tableau `rows` en ordre d'affichage, chaque ligne portant
`{ id, mot, indice, nether, actif }`. Le rendu sépare les lignes en deux groupes
selon `actif`.

**Tableau « Mots actifs »** (lignes où `actif !== false`), colonnes :
1. Réordonner : poignée `☰` (glisser) + `▲`/`▼`.
2. `mot` : champ input + aperçu syllabes en gris dessous (ex. `→ mi·lieu`),
   via `apercuSyllabes` existant.
3. `indice` : champ input (colonne pouvant rétrécir sur petit écran).
4. `🔥` : case Nether.
5. `⏸` : mettre de côté (passe `actif:false`).
6. `🗑` : supprimer définitivement la ligne.

**Section « Mots de côté (n) »** (lignes où `actif === false`), plus discrète :
mot affiché grisé (lecture seule), bouton `▶ Réactiver` (passe `actif:true`),
`🗑` supprimer. Si la liste des inactifs est vide, la section n'est pas affichée.

**Réordonnancement** : ne s'applique qu'aux mots actifs.
- `▲`/`▼` : échangent la ligne avec la ligne **active** précédente / suivante
  dans `rows` (sauter les éventuelles lignes inactives intercalées).
- Glisser-déposer : actif uniquement entre lignes actives.
- `▲` désactivé sur la première ligne active, `▼` sur la dernière.

**Réactivation** : la ligne réactivée est déplacée **en fin de liste active**
(append), pas à sa position d'origine.

**Boutons** :
- `➕ Ajouter un mot` : ajoute une ligne active vide en fin de liste.
- `↺ Reset` : voir §4.
- `Annuler` : ferme sans rien persister.
- `✅ Valider` : voir §5.

### 4. Reset (différé, confirmé)

Au clic `↺ Reset` : afficher une confirmation
(`window.confirm`) :
« Remettre la liste de mots par défaut ? Tes réglages actuels seront remplacés
(effectif après Valider). »
Si confirmé : `setRows(withIds(defaultMots()))` (la section « Mots de côté »
devient vide, puisque les défauts sont tous actifs). **Aucune** écriture
localStorage à ce stade.

### 5. Valider

À la validation : filtrer les lignes dont `mot` est non vide, puis
`onValidate(rows.map(r => ({ mot, indice, nether, actif })), name)`.
`App.enregistrerConfig` met à jour l'état et appelle `saveConfig`, qui persiste
désormais `actif`. Après un Reset suivi d'un Valider, le localStorage contient la
liste par défaut → équivaut à repartir de zéro.

Note : on ne supprime pas la clé localStorage (`removeItem`) ; réécrire les
défauts via `saveConfig` produit le même état observable (`loadConfig` renvoie
les défauts), tout en gardant la sécurité « Annuler ne perd rien ».

## Tests / vérification

Tests purs (Vitest) — nouveau fichier `src/config.test.js` :
- `toEntry`/`defaultMots` : une entrée chaîne et une entrée objet sans `actif`
  donnent `actif: true`.
- Round-trip : `saveConfig` puis `loadConfig` conserve une entrée `actif:false`
  (avec un mock simple de `localStorage` en environnement de test).

UI et filtrage jeu/Nether : vérifiés manuellement en jouant la boucle dans le
navigateur (pas de tests UI automatisés dans ce projet) :
- Désactiver un mot → il disparaît du compteur d'accueil, du jeu, et du Nether.
- Réactiver → il réapparaît.
- Reset puis Valider → liste par défaut ; Reset puis Annuler → liste conservée.

## Fichiers touchés

- `src/config.js` — champ `actif` dans `toEntry` et `saveConfig`.
- `src/App.jsx` — filtrer les inactifs dans `motsListe`.
- `src/screens/WordEditor.jsx` — refonte en tableau + section « Mots de côté » +
  désactiver/réactiver + Reset confirmé.
- `src/config.test.js` — nouveau, tests purs du modèle.
- `CLAUDE.md` — mettre à jour la description de l'éditeur (tableau, mots de côté,
  Reset) une fois implémenté.

## Risques / points d'attention

- Réordonnancement avec lignes inactives intercalées dans `rows` : bien sauter
  les inactives pour les flèches et le glisser.
- Responsive : le tableau ne doit pas casser la modale sur téléphone (largeur
  max 560px) — prévoir `overflow-x` ou colonnes flexibles.
- Ne pas réintroduire de champ caché à focuser (le jeu capte le clavier via un
  listener `document`, sans rapport avec l'éditeur, mais rester sur des inputs
  classiques côté éditeur).
