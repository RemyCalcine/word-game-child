# Migration vers Vite + React et habillage « design system » + mode Nether

Date : 2026-06-20

## Contexte

Le jeu « Les Mots Blocs » existe en version vanilla HTML/CSS/JS fonctionnelle
(`index.html`, `style.css`, `game.js`, `words.js`). Un design system plus
poussé a été produit séparément avec Claude Design (`Les-Mots-Blocs/`) :
textures de blocs 16×16, polices (Press Start 2P, Baloo 2, VT323), icône
diamant pixel-art, tokens CSS (couleurs, biseaux 4px, ombres dures, grille
4px), et un prototype React cliquable qui rejoue toute la boucle de jeu plus
un nouveau mode **Nether** (épreuve de rappel sans blocs-lettres).

Décision validée avec l'utilisateur : on migre le jeu vers un vrai projet
**Vite + React** (avec build local, lancé via `npm run dev`), on reprend
l'habillage visuel du design system, et on ajoute le mode Nether comme
nouvelle fonctionnalité. Les fichiers vanilla actuels sont remplacés une fois
la parité atteinte. La logique de jeu (découpage syllabes, voix, capture
clavier, score) est **portée**, pas réécrite : ce projet doit produire le même
comportement que `game.js` aujourd'hui, plus le Nether.

## Hors périmètre

- Pas de dépendance au bundle compilé du design system (`_ds_bundle.js`) :
  les composants visuels sont réécrits localement (mêmes props/esthétique),
  pour que le projet reste autonome de `Les-Mots-Blocs/`.
- Pas de backend, pas de compte, pas de persistance (le score reste en
  mémoire pour la session, comme aujourd'hui).
- Pas de refonte du contenu pédagogique (mêmes règles de découpage syllabes,
  même ton, même format de `words.js`).

## Architecture

Projet Vite + React (JS, pas TypeScript — cohérent avec le projet actuel qui
n'utilise pas de typage statique) à la racine du repo.

```
word-game/
├── index.html              # shell Vite (remplace l'actuel)
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx             # point d'entrée React
│   ├── App.jsx              # state machine + écrans (équivalent game.js)
│   ├── words.js             # liste MOTS (même format + `nether: true`)
│   ├── wordList.js          # normaliser() / decouperAuto() (logique pure)
│   ├── voice.js             # speechSynthesis (amorcerVoix/parler)
│   ├── useWriting.js        # hook : capture clavier de l'écran écriture
│   ├── components/
│   │   ├── BlockButton.jsx
│   │   ├── IconButton.jsx
│   │   ├── LetterTile.jsx
│   │   ├── SyllableTile.jsx
│   │   ├── ProgressTrack.jsx
│   │   ├── HudBar.jsx
│   │   ├── BlockPanel.jsx
│   │   ├── Badge.jsx
│   │   └── PortalButton.jsx
│   ├── screens/
│   │   ├── StartScreen.jsx
│   │   ├── LearnScreen.jsx       # écoute (étape 1) + épeler
│   │   ├── SyllablesScreen.jsx   # étape 2
│   │   ├── WriteScreen.jsx       # étape 3, réutilisé en mode nether (prop `nether`)
│   │   ├── WinScreen.jsx
│   │   ├── EndScreen.jsx
│   │   └── nether/
│   │       ├── NetherIntroScreen.jsx
│   │       ├── NetherFlashScreen.jsx   # feedback bonne/mauvaise réponse
│   │       └── NetherEndScreen.jsx
│   ├── styles/
│   │   ├── tokens.css       # adapté de Les-Mots-Blocs/tokens/*.css
│   │   └── index.css        # styles globaux (ground bg, anims, .mc-logo)
│   └── assets/
│       ├── fonts/           # copiés depuis Les-Mots-Blocs/fonts/
│       ├── textures/        # copiés depuis Les-Mots-Blocs/assets/textures/
│       └── icons/diamond.png
└── CLAUDE.md                # mis à jour en fin de migration
```

`words.js` reste le seul fichier que le parent édite, au même format qu'aujourd'hui.

## Modèle de données

`src/words.js` — même format qu'actuellement (chaîne, chaîne avec tirets, ou
`{ mot, indice }`), avec un champ optionnel supplémentaire :

```js
{ mot: "fa-mille", indice: "...", nether: true }
```

`normaliser()` (portée depuis `game.js`) produit
`{ mot, indice, syllabes, nether }` (`nether` par défaut `false`).

`decouperAuto()` est portée **telle quelle**, fonction pure, testable
isolément (`node` ou un test Vitest si on en ajoute un — voir Tests).

## State machine (`App.jsx`)

Remplace l'objet `etat` + les fonctions `lancerX()/montrer()` de `game.js`
par un state React. Écrans (`screen`) :

```
start → learn → syll → write → win → (mot suivant ou) end → [nether-intro → nether-write → nether-flash → nether-end]
```

État global (`useState` ou `useReducer` dans `App.jsx`) :

```js
{
  screen,        // 'start' | 'learn' | 'syll' | 'write' | 'win' | 'end' | 'nether-intro' | ...
  index,         // index du mot courant (parcours principal)
  xp,            // diamants
  netherIndex,   // index dans la sous-liste des mots nether
  netherWordsOk, // mots nether réussis (pour l'écran de fin nether)
}
```

Toute la logique métier déjà écrite dans `game.js` est portée sans changement
de comportement :
- `retour()` → fonction `goBack()` avec les mêmes règles (étape précédente,
  ou mot précédent depuis l'écoute, masqué sur le tout premier mot — et sur
  les écrans win/end comme aujourd'hui).
- Numérotation dynamique des étapes (`nbEtapes()` : 2 si une seule syllabe,
  sinon 3) reprise à l'identique pour le `step-label`.
- Puzzle syllabes : seule la bonne syllabe suivante peut être posée, erreur =
  secousse + pas de blâme, indice clignotant après 3 erreurs, bonus si sans
  faute, enchaînement auto vers l'écriture après la phrase de fin parlée.
- Écriture : capture clavier via un listener `document` `keydown` actif
  seulement quand l'écran d'écriture est affiché (porté dans le hook
  `useWriting.js`, avec un `useEffect` qui ajoute/retire le listener selon
  l'écran actif) — **pas de champ input**, comme l'exige `CLAUDE.md`.
- Voix : `voice.js` porte `chargerVoix/amorcerVoix/dire/parler` tels quels
  (même contournement du moteur Chrome : `cancel()` puis `setTimeout(150ms)`
  avant de reparler).
- Épeler (`#btn-spell` → `epeler()`) : porté dans `LearnScreen.jsx` —
  surlignage lettre par lettre (état `spelling` de `LetterTile`) au rythme
  de 750ms, voix ralentie (`vitesse 0.7`) par lettre puis le mot entier à la
  fin, avec `synth.cancel()` avant de démarrer la séquence.
- `Étape X/X` sur l'écran d'écriture : `nbEtapes()` est aussi le numérateur
  affiché pour l'écriture (toujours la dernière étape, donc "2/2" ou "3/3",
  jamais "3/4") — particularité à reproduire telle quelle, pas un bug.
- Rejouer (`btn-replay` → `recommencer()`) : remet `index` et `xp` à 0 et
  relance `lancerDecouverte()`. Réinitialise aussi `netherIndex` et
  `netherWordsOk` (et l'XP gagné dans le Nether, cf. section Nether) pour
  repartir d'une session entièrement neuve.

## Mode Nether (nouveau)

Déclenché depuis `EndScreen` via `PortalButton`, visible **seulement si** au
moins un mot de `MOTS_LISTE` a `nether: true`. Sinon le bouton est absent
(pas grisé) — c'est un comportement voulu : un parent qui ne tague aucun mot
ne verra jamais le portail, le jeu reste identique à aujourd'hui plus
l'habillage visuel. La liste de mots livrée par défaut (`src/words.js`)
taguera 1-2 mots à titre d'exemple pour que la fonctionnalité soit visible et
testable dès le premier lancement.

Sous-liste : `motsNether = MOTS_LISTE.filter(m => m.nether)`.

Écrans (`screens/nether/`) :
1. **NetherIntroScreen** — présente l'épreuve (« Pas de blocs pour t'aider »),
   bouton pour démarrer.
2. **WriteScreen** (réutilisé, prop `nether={true}`) — l'enfant entend le mot
   (`parler()`) puis le tape de mémoire au clavier ; pas de blocs-lettres
   affichés pendant la saisie (contrairement à l'étape écriture normale qui
   montre des cases vides à remplir). Réutilise le hook `useWriting.js` ; le
   composant bascule son rendu (pas de `LetterTile`) et son thème
   (`.theme-nether`) selon la prop, en s'inspirant du `kit-app.jsx` du
   design system qui suit la même approche (un seul composant, deux modes).
3. **NetherFlashScreen** — feedback bref (correct/à revoir) puis passage
   automatique au mot nether suivant, ou vers `NetherEndScreen` si c'était le
   dernier.
4. **NetherEndScreen** — récapitulatif (« Nether vaincu ! », mots réussis,
   diamants gagnés dans le Nether), bouton retour à l'accueil.

Thème : `class="theme-nether"` posée sur le conteneur racine pendant tout le
flow Nether, qui bascule les tokens CSS sémantiques (cf.
`tokens/colors.css` du design system : obsidienne/lave/portail). Le ton reste
encourageant, jamais punitif, conformément au design system (`readme.md`
section « THE NETHER »).

XP : chaque mot nether réussi rapporte **+15 💎** (cohérent avec le
prototype `kit-app.jsx` du design system), ajoutés à `etat.xp` au même
endroit que le score principal — donc visibles aussi sur le HUD si on revient
à l'accueil. `recommencer()` réinitialise ce total comme le reste de l'XP.

## Visuel — composants (`src/components/`)

Réécrits en React local à partir des `.jsx`/`.d.ts`/`.prompt.md` du design
system (mêmes props, même rendu), sans dépendre du bundle compilé :

- **BlockButton** — remplace `.mc-btn` : fond texturé ou couleur pleine,
  biseau 4px, ombre dure `0 6px 0`, press = `translateY(4px)` + ombre
  réduite.
- **IconButton** — bouton carré (flèche retour, réécouter).
- **LetterTile** — remplace `.letter` (états empty/good/bad/spelling).
- **SyllableTile** — remplace `.syll-tile` (états filled/indice/shake/disabled).
- **ProgressTrack** — remplace `.progress-track`/`#progress-bar`.
- **HudBar** — compose IconButton (retour) + ProgressTrack + Badge (diamants).
- **BlockPanel** — conteneur parchemin avec biseau, utilisé pour les écrans.
- **Badge** — pastille diamant (`+10 💎`).
- **PortalButton** — bouton du portail Nether (gradient animé, glow violet).

Tokens (`src/styles/tokens.css`) : adaptés de `Les-Mots-Blocs/tokens/colors.css`
(+ scope `.theme-nether`), `typography.css`, `spacing.css`, `effects.css`,
`textures.css`, `fonts.css`. `--radius: 0` partout, pas de coin arrondi.

Polices : self-hébergées via `@font-face` dans `tokens.css`, fichiers copiés
dans `src/assets/fonts/` (Press Start 2P pour titres/HUD/boutons courts,
Baloo 2 pour le corps de texte et les mots à lire/écrire, VT323 en option
pour les chiffres du HUD si utilisé).

Textures : copiées dans `src/assets/textures/` (grass, dirt, stone, planks,
sandstone, netherrack, obsidian, nether_ground), rendues `image-rendering:
pixelated`, tailles multiples de 16px (32–64px), via les tokens `--tex-*` +
classe utilitaire `.block-tex`.

Icône diamant : `src/assets/icons/diamond.png`, utilisée dans `Badge`/`HudBar`
à la place de l'emoji 💎 pour le compteur de score (l'emoji reste utilisé
ailleurs comme langage d'icônes : 🔊 🧩 ⛏️ ✏️ 🎉 🏆 🌟 👂 🔁).

## Migration / ordre de travail

1. Scaffold Vite + React à la racine (`npm create vite@latest . -- --template react`,
   à adapter en JS si le template propose JS/TS séparément).
2. Copier les assets nécessaires (fonts, textures, icône diamant) dans
   `src/assets/`.
3. Porter les tokens CSS du design system dans `src/styles/tokens.css`.
4. Porter la logique pure : `wordList.js` (`normaliser`/`decouperAuto`),
   `voice.js` (synthèse vocale).
5. Construire les composants visuels (`src/components/`).
6. Construire les écrans existants (`src/screens/*.jsx` hors `nether/`) et
   `App.jsx` (state machine), en vérifiant la parité de comportement avec
   `game.js` à chaque écran.
7. Ajouter le mode Nether (composants + écrans + thème).
8. Copier `words.js` (ajouter `nether: true` sur 1-2 mots d'exemple pour
   pouvoir tester le portail).
9. Supprimer les anciens fichiers vanilla (`index.html` racine remplacé par
   le shell Vite, `style.css`, l'ancien `game.js`) une fois la parité validée
   en jouant la boucle complète dans le navigateur.
10. Mettre à jour `CLAUDE.md` : stack (Vite + React), commande de lancement
    (`npm run dev` / `npm run build`), nouvelle architecture de fichiers,
    nouveau champ `nether` dans `words.js`.

## Tests / vérification

Pas de suite de tests automatisés actuellement (projet volontairement
minimal) ; on garde cette approche :

- `decouperAuto()` reste une fonction pure testable via `node -e` ou un test
  Vitest ponctuel si on veut figer la non-régression du découpage syllabes
  pendant le portage.
- Vérification manuelle dans le navigateur (`npm run dev`) de la boucle
  complète : accueil → écoute → épeler → syllabes (erreur/indice/bonus) →
  écriture (bonne/mauvaise lettre, mot complet) → bravo → mot suivant → fin
  → portail Nether (intro → écriture de mémoire → flash → fin) → rejouer.
- Vérifier la flèche retour à chaque étape (y compris masquée sur le premier
  mot et sur win/end).
- Vérifier le fallback navigateur sans `speechSynthesis` (pas de crash, le
  callback `surFin` est appelé immédiatement).
- Vérifier le cas `MOTS_LISTE` vide (message d'avertissement, bouton
  désactivé) comme dans `game.js`.

## Risques / points d'attention

- La synthèse vocale Chrome a des comportements fragiles déjà contournés
  dans `game.js` (`cancel()` + délai 150ms) — à reproduire fidèlement pour
  ne pas réintroduire les mots tronqués.
- Le listener clavier global doit être strictement scopé à l'écran actif
  (write ou nether-write) via `useEffect`/cleanup, sinon risque de capturer
  des touches sur le mauvais écran lors des transitions React (asynchrones
  par nature, contrairement aux classes CSS synchrones de l'ancien code).
- `npm run build` produit des fichiers qui nécessitent un serveur HTTP (pas
  de `file://` direct comme avant, à cause des modules ES) — `npm run dev`
  ou un serveur statique (`npx http-server` déjà mentionné dans
  `CLAUDE.md`) seront nécessaires pour jouer. La phrase actuelle du
  `CLAUDE.md` (« aucun `fetch`, donc `file://` fonctionne ») devient fausse
  et doit être **supprimée/réécrite**, pas simplement complétée, dans
  l'étape 10 de la migration.
