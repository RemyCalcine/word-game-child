# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Le projet

Petit jeu web **léger** pour aider un enfant à réviser ses **mots de dictée**. L'enfant a du mal à apprendre ses mots sur papier ; le but est de **gamifier** la révision pour lui donner envie.

Univers visuel inspiré de **Minecraft** (l'enfant adore) : blocs, pixel art, palette terre/herbe/pierre, police pixelisée.

### Boucle de jeu visée

À partir d'une **liste de mots** fournie par le parent, le jeu génère des petits **niveaux**. Pour chaque mot, l'enfant :

1. découvre le mot et son orthographe,
2. apprend à l'écrire **lettre par lettre**,
3. travaille les **sons** (décomposition du mot en sons / syllabes),
4. **tape le mot au clavier** pour vérifier qu'il a compris,
5. reçoit des **félicitations** et débloque l'étape suivante.

### Principes produit

- **Léger et simple avant tout** : le parent donne une liste de mots → le jeu se génère tout seul. Pas de back-end, pas de compte, pas d'installation idéalement.
- Cible : un enfant. Interface très visuelle, gros boutons, peu de texte, retours sonores/visuels gratifiants.
- Le contenu est en **français** (les sons, syllabes et règles d'orthographe sont spécifiques au français).

### Stack & architecture

Application **Vite + React** (JS, pas TypeScript). Pas de stack lourde sans raison : pas de backend, pas de compte. Le score reste en mémoire pour la session ; seule la **config** (liste de mots + prénom de l'enfant) est persistée côté navigateur (`localStorage`, voir `src/config.js`).

Pour chaque mot, 3 étapes (machine à états entre écrans React) : **Découverte → 🧩 Syllabes → ✏️ Écriture → 🎉 Bravo**. Un mot d'une seule syllabe saute l'étape Syllabes. Un mode optionnel **Nether** (épreuve de rappel sans blocs-lettres) est accessible depuis la page de récap de fin si au moins un mot est tagué `nether: true`. En Nether, l'enfant peut **réessayer** ou **passer** un mot après une erreur (jamais d'« échec » affiché) ; la `RecapScreen` commune (fin d'overworld *et* sortie du Nether) liste les mots et le total de diamants cumulé.

Fichiers principaux (`src/`) :

- `src/App.jsx` — la machine à états entre écrans (équivalent de l'ancien `game.js`) : tient la config en état React (`entrees` + `prenom`, chargée via `loadConfig()`), génère `motsListe`/`motsNether` à la volée, score/diamants, enchaînement des écrans.
- `src/words.js` — le tableau `MOTS` : **liste de mots par défaut** (seed du premier lancement / du bouton « Réinitialiser »). Une entrée = `"mot"`, `"mo-t"` (tirets = découpage syllabes choisi) ou `{ mot, indice, nether }`. Le parent peut éditer ce fichier, mais surtout passer par l'**éditeur in-app** (⚙️ sur l'accueil).
- `src/config.js` — chargement/sauvegarde de la config dans `localStorage` (`loadConfig`/`saveConfig`/`defaultMots`). La config persistée prime sur `words.js`.
- `src/wordList.js` — logique pure portée de l'ancien `game.js` : `normaliser()` et `decouperAuto()` (découpage syllabes) ; `prepareList()` transforme les entrées en `{ mot, indice, syllabes, nether }`.
- `src/voice.js` — synthèse vocale (`speechSynthesis`, fr-FR) : `amorcerVoix`/`parler`/`annulerVoix`.
- `src/screens/` — un composant par écran (`StartScreen`, `LearnScreen`, `SyllablesScreen`, `WriteScreen`, `WinScreen`, `RecapScreen`, `WordEditor`, plus `screens/nether/` pour le mode Nether). `WriteScreen` est réutilisé pour l'écriture normale et pour l'épreuve Nether via une prop (le mode Nether ajoute les boutons « Nouvelle tentative » / « Passer »). `RecapScreen` est la page de récap commune (fin d'overworld + sortie de Nether) ; elle porte les boutons **Rejouer** / **Quitter la partie** (retour à l'accueil). `WordEditor` est l'éditeur de mots (modal ⚙️) : accessible **uniquement depuis l'accueil**, réordonnancement par glisser-déposer, aperçu syllabes en direct, champ indice + case Nether par mot, prénom de l'enfant ; il applique à la validation.
- `src/components/` — composants visuels du thème « Minecraft » (boutons en relief, blocs-lettres, tuiles syllabes, HUD, etc.), thème CSS dans `src/styles/tokens.css` et `src/index.css`.

Conventions importantes :

- `App.jsx` tient l'état React (écran courant, index du mot, score, config) et dérive `motsListe` (via `prepareList()` sur les `entrees` de la config) ; l'éditeur ⚙️ met à jour ces entrées et `saveConfig()` les persiste.
- **Syllabes hybrides** : tirets dans `words.js` = découpage du parent ; sinon `decouperAuto()` (heuristique français, volontairement imparfaite — les sons piège se corrigent avec un tiret). Le `mot` réel = la chaîne sans les tirets.
- Puzzle syllabes : l'enfant ne peut poser que la **bonne syllabe suivante** (pas de placement faux possible) ; une erreur ne fait que secouer la tuile. Bonus 💎 si reconstruit sans erreur ; indice clignotant après 3 erreurs. Puzzle réussi → passage **automatique** à l'écriture (pas de bouton).
- Navigation : une **flèche ← retour** dans le HUD revient à l'étape précédente du mot ; sur l'écran d'écoute (étape 1) elle revient au mot précédent, et est masquée sur le tout premier mot (via `visibility` pour garder la place). Le libellé du bouton de l'étape 1 s'adapte : « Jouer avec les syllabes » ou « Écris le mot » si le mot n'a qu'une syllabe.
- La saisie de l'enfant à l'écriture est captée par un **listener `keydown` sur `document`** (pas de champ input), géré dans `WriteScreen.jsx` via un `useEffect` qui l'ajoute/le retire selon l'écran actif. Ne pas réintroduire de champ caché à focuser (source de bugs de focus).
- Comparaison des lettres en minuscules, accents inclus (mots français).

### Lancer / tester

Projet Vite+React : `npm install` puis `npm run dev` pour lancer en local
(`http://localhost:5173`), `npm run build` pour produire un build statique
dans `dist/` (nécessite un serveur HTTP pour être ouvert, pas de `file://`
direct — modules ES). Pas de back-end, pas de compte.

`npm run test` lance les tests Vitest (logique pure de découpage syllabes
dans `src/wordList.test.js`). Pas de tests UI automatisés : vérifier les
changements en jouant la boucle dans le navigateur.

## Comment travailler dans ce repo

Ces règles réduisent les erreurs classiques. Elles privilégient la prudence sur la vitesse — pour une tâche triviale, utilise ton jugement.

### 1. Réfléchir avant de coder

Ne pas supposer. Ne pas masquer une incompréhension. Exposer les compromis.

- Énoncer ses hypothèses explicitement. En cas de doute, demander.
- Si plusieurs interprétations existent, les présenter — ne pas en choisir une en silence.
- Si une approche plus simple existe, le dire. Contredire quand c'est justifié.
- Si quelque chose n'est pas clair, s'arrêter, nommer ce qui est confus, demander.

### 2. La simplicité d'abord

Le minimum de code qui résout le problème. Rien de spéculatif.

- Aucune fonctionnalité au-delà de ce qui est demandé.
- Aucune abstraction pour du code utilisé une seule fois.
- Aucune « flexibilité » / « configurabilité » non demandée.
- Aucune gestion d'erreur pour des cas impossibles.
- Si 200 lignes pourraient en faire 50, réécrire.

Se demander : « Un ingénieur senior dirait-il que c'est sur-compliqué ? » Si oui, simplifier. C'est d'autant plus vrai ici : le projet doit rester **petit et léger**.

### 3. Des changements chirurgicaux

Ne toucher qu'au strict nécessaire. Ne nettoyer que ses propres dégâts.

- Ne pas « améliorer » le code, les commentaires ou le formatage adjacents.
- Ne pas refactorer ce qui n'est pas cassé.
- Respecter le style existant, même si on ferait autrement.
- Si on repère du code mort non lié, le signaler — ne pas le supprimer.
- Supprimer les imports/variables/fonctions rendus inutiles **par ses propres changements**.

Test : chaque ligne modifiée doit se rattacher directement à la demande.

### 4. Exécution guidée par l'objectif

Définir des critères de réussite. Boucler jusqu'à vérification.

- « Ajouter une validation » → « Écrire des tests pour les entrées invalides, puis les faire passer ».
- « Corriger le bug » → « Écrire un test qui le reproduit, puis le faire passer ».
- Pour une tâche en plusieurs étapes, énoncer un bref plan avec, pour chaque étape, comment la vérifier.
