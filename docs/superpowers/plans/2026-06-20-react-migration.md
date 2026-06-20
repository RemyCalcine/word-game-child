# Migration Vite+React — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le jeu vanilla JS « Les Mots Blocs » par un projet Vite+React équivalent fonctionnellement, habillé avec le design system `Les-Mots-Blocs/`, et y ajouter le mode Nether.

**Architecture:** Scaffold Vite+React à la racine. La logique pure (découpage syllabes, voix) est portée telle quelle depuis `game.js` dans des modules JS séparés et testée avec Vitest. Les composants visuels sont copiés depuis `Les-Mots-Blocs/components/` (déjà du React + CSS-vars prêt à l'emploi) avec adaptation des chemins d'assets. L'état du jeu vit dans un seul composant `App.jsx` (state machine), sur le modèle de `Les-Mots-Blocs/ui_kits/word-game/kit-app.jsx` — mais branché sur les vraies données (`words.js`) et la vraie synthèse vocale (avec ses contournements Chrome), pas les versions simplifiées du kit.

**Tech Stack:** Vite, React 18, Vitest (un seul fichier de test pour la logique pure de découpage syllabes — pas de suite de tests UI, cohérent avec l'absence de tests dans le projet actuel).

**Référence à lire avant de commencer (pas du code à copier tel quel, mais le comportement à reproduire) :**
- `word-game/game.js`, `word-game/words.js`, `word-game/index.html`, `word-game/style.css` (comportement actuel à préserver)
- `word-game/Les-Mots-Blocs/ui_kits/word-game/kit-app.jsx` et `kit-ui.jsx` (squelette React le plus proche — sert de patron pour `App.jsx`, mais utilise des données et une voix simplifiées à remplacer)
- `word-game/Les-Mots-Blocs/components/**/*.jsx` (composants visuels à copier)
- `word-game/Les-Mots-Blocs/tokens/*.css` (valeurs à consolider dans `src/styles/tokens.css`)
- `word-game/docs/superpowers/specs/2026-06-20-react-migration-design.md` (spec validée)

---

### Task 1: Scaffold du projet Vite+React

**Files:**
- Create: `package.json`, `vite.config.js`, `.gitignore` (ajouter `node_modules`, `dist`), `src/main.jsx`, `src/App.jsx` (placeholder), `index.html` (à la racine, remplace l'actuel provisoirement)

- [ ] **Step 1: Scaffolder avec Vite**

Run: `npm create vite@latest . -- --template react`

Le dossier n'est pas vide (fichiers vanilla actuels) : l'outil va le signaler et demander confirmation. Choisir l'option qui continue malgré les fichiers existants. Vite va **écraser `index.html`** (un fichier du même nom existe déjà — c'est le shell HTML du jeu vanilla) pour le remplacer par son propre shell : c'est voulu, `index.html` devient le point d'entrée du nouveau projet React dès cette étape. `style.css`, `game.js` et l'ancien `words.js` à la racine ne sont pas touchés par le scaffold et seront supprimés explicitement à la Task 11.

- [ ] **Step 2: Installer les dépendances**

Run: `npm install`

- [ ] **Step 3: Vérifier que le serveur de dev démarre**

Run: `npm run dev`
Expected: serveur Vite démarre sur `http://localhost:5173`, la page par défaut Vite+React s'affiche dans le navigateur. Arrêter le serveur (Ctrl+C) après vérification.

- [ ] **Step 4: Installer Vitest pour le test de logique pure**

Run: `npm install -D vitest`

Ajouter dans `package.json` un script :
```json
"scripts": {
  "test": "vitest run"
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.js .gitignore src/main.jsx src/App.jsx index.html
git commit -m "Scaffold Vite+React project"
```

---

### Task 2: Copier les assets visuels (polices, textures, icône diamant)

**Files:**
- Create: `src/assets/fonts/PressStart2P.woff2`, `src/assets/fonts/VT323.woff2`, `src/assets/fonts/Baloo2-{400,600,700,800}.woff2`
- Create: `src/assets/textures/{dirt,grass_side,grass_top,nether_ground,netherrack,obsidian,planks,sandstone,stone}.png`
- Create: `src/assets/icons/diamond.png`

- [ ] **Step 1: Copier les polices**

Run (PowerShell ou Bash selon l'outil disponible) :
```bash
mkdir -p src/assets/fonts src/assets/textures src/assets/icons
cp Les-Mots-Blocs/fonts/*.woff2 src/assets/fonts/
cp Les-Mots-Blocs/assets/textures/*.png src/assets/textures/
cp Les-Mots-Blocs/assets/icons/diamond.png src/assets/icons/
```

- [ ] **Step 2: Vérifier la copie**

Run: `ls src/assets/fonts src/assets/textures src/assets/icons`
Expected: 6 fichiers `.woff2`, 9 fichiers `.png` de textures, 1 `diamond.png`.

- [ ] **Step 3: Commit**

```bash
git add src/assets
git commit -m "Copy fonts, textures and diamond icon assets from design system"
```

---

### Task 3: Tokens CSS (`src/styles/tokens.css`)

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Écrire le fichier consolidé**

Fusionner `Les-Mots-Blocs/tokens/{fonts,colors,typography,spacing,effects,textures}.css` en un seul fichier, en adaptant les chemins d'assets (`../assets/fonts/...`, `../assets/textures/...` relatifs à `src/styles/`) :

```css
/* ===== FONTS ===== */
@font-face {
  font-family: "Press Start 2P";
  font-style: normal; font-weight: 400; font-display: swap;
  src: url("../assets/fonts/PressStart2P.woff2") format("woff2");
}
@font-face {
  font-family: "VT323";
  font-style: normal; font-weight: 400; font-display: swap;
  src: url("../assets/fonts/VT323.woff2") format("woff2");
}
@font-face {
  font-family: "Baloo 2";
  font-style: normal; font-weight: 400; font-display: swap;
  src: url("../assets/fonts/Baloo2-400.woff2") format("woff2");
}
@font-face {
  font-family: "Baloo 2";
  font-style: normal; font-weight: 600; font-display: swap;
  src: url("../assets/fonts/Baloo2-600.woff2") format("woff2");
}
@font-face {
  font-family: "Baloo 2";
  font-style: normal; font-weight: 700; font-display: swap;
  src: url("../assets/fonts/Baloo2-700.woff2") format("woff2");
}
@font-face {
  font-family: "Baloo 2";
  font-style: normal; font-weight: 800; font-display: swap;
  src: url("../assets/fonts/Baloo2-800.woff2") format("woff2");
}

:root {
  /* ---- Raw block fills ---- */
  --grass: #6aab3c; --grass-dark: #4d8a2a; --grass-light: #8bc659;
  --dirt: #7a5230; --dirt-dark: #573a20; --dirt-light: #976a44;
  --stone: #8a8a8a; --stone-dark: #5f5f5f; --stone-light: #a8a8a8;
  --water: #3aa6d6; --water-dark: #2a7ba0; --water-light: #5fc1e8;
  --sky-top: #79b7e6; --sky-bottom: #a9d4f0;
  --diamond: #5fe0d8; --diamond-dark: #34b6ae; --emerald: #17b978;
  --gold: #f9c629; --gold-dark: #d49e10;
  --lava: #f4801f; --lava-bright: #ff5a1f; --lava-dark: #b8480c;
  --netherrack: #6e2b2b; --obsidian: #2a1a3e; --obsidian-deep: #1a1024;
  --portal: #a64ad6; --portal-bright: #c060f0;
  --ink: #2b2018; --ink-soft: #4a3b2e;
  --cream: #f4ead0; --cream-dim: #d8cba8;
  --paper: #fbf6e9; --paper-edge: #e7dcc0;
  --good: #5fd35f; --good-dark: #3da53d; --good-ink: #0b3d0b;
  --bad: #e0544f; --bad-dark: #b3332e; --warn: #f9c629;
  --relief-light: #ffffff80; --relief-dark: #00000055;
  --relief-light-strong: #ffffffaa; --relief-dark-strong: #00000077;

  --surface-sky: linear-gradient(180deg, var(--sky-top), var(--sky-bottom));
  --surface-grass: var(--grass); --surface-dirt: var(--dirt); --surface-stone: var(--stone);
  --surface-card: var(--paper); --surface-overlay: #1a1024d9;

  --text-on-dark: var(--cream); --text-ink: var(--ink); --text-muted: var(--ink-soft);
  --text-good: var(--good-ink); --text-bad: #fff; --text-reward: var(--diamond);

  --action-primary: var(--grass); --action-primary-edge: var(--grass-dark);
  --action-secondary: var(--water); --action-secondary-edge: var(--water-dark);
  --action-reward: var(--diamond); --action-reward-edge: var(--diamond-dark);
  --action-danger: var(--bad); --action-danger-edge: var(--bad-dark);
  --action-neutral: var(--stone); --action-neutral-edge: var(--stone-dark);

  --tile-face: var(--cream); --tile-ink: var(--ink);
  --tile-correct: var(--good); --tile-wrong: var(--bad); --tile-active: var(--diamond);

  --progress-track: var(--stone-dark); --progress-fill: var(--diamond); --xp-color: var(--diamond);

  /* ---- Typography ---- */
  --font-display: "Press Start 2P", "Courier New", monospace;
  --font-text: "Baloo 2", "Segoe UI", system-ui, sans-serif;
  --font-mono: "VT323", "Courier New", monospace;
  --display-hero: 34px; --display-xl: 24px; --display-lg: 20px;
  --display-md: 14px; --display-sm: 11px; --display-xs: 10px;
  --text-2xl: 30px; --text-xl: 22px; --text-lg: 18px; --text-md: 16px; --text-sm: 14px;
  --tile-letter-size: 30px; --tile-syllable-size: 26px;
  --weight-regular: 400; --weight-medium: 600; --weight-bold: 700; --weight-black: 800;
  --leading-display: 1.4; --leading-tight: 1.15; --leading-body: 1.45;
  --tracking-display: 0.5px; --tracking-text: 0;

  /* ---- Spacing ---- */
  --px: 4px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-16: 64px;
  --radius: 0px;
  --block-border: 4px; --block-border-thin: 3px; --block-border-thick: 6px;
  --block-pop: 6px; --block-pop-sm: 4px; --block-pop-lg: 8px;
  --tile-letter: 58px; --tile-letter-sm: 44px;
  --tile-syllable-h: 60px; --tile-syllable-min: 84px;
  --control-h: 48px; --hud-h: 64px;
  --content-max: 720px; --gap-tiles: 10px; --gap-row: 14px; --pad-screen: 24px;

  /* ---- Effects ---- */
  --bevel: var(--relief-light) var(--relief-dark) var(--relief-dark) var(--relief-light);
  --bevel-strong: var(--relief-light-strong) var(--relief-dark-strong) var(--relief-dark-strong) var(--relief-light-strong);
  --bevel-inset: var(--relief-dark) var(--relief-light) var(--relief-light) var(--relief-dark);
  --pop: 0 var(--block-pop) 0 #00000044;
  --pop-sm: 0 var(--block-pop-sm) 0 #00000044;
  --pop-lg: 0 var(--block-pop-lg) 0 #00000055;
  --pop-pressed: 0 2px 0 #00000044;
  --inset-sheen: inset 0 0 0 2px #ffffff22;
  --text-shadow-pixel: 2px 2px 0 #00000066;
  --text-shadow-pixel-lg: 3px 3px 0 #00000077;
  --text-shadow-pixel-sm: 1px 1px 0 #00000055;
  --scrim: #1a1024cc;
  --t-press: 60ms; --t-quick: 120ms;
  --t-pop: 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --t-progress: 350ms ease;

  /* ---- Textures ---- */
  --tex-dirt: url("../assets/textures/dirt.png");
  --tex-grass-top: url("../assets/textures/grass_top.png");
  --tex-grass-side: url("../assets/textures/grass_side.png");
  --tex-stone: url("../assets/textures/stone.png");
  --tex-planks: url("../assets/textures/planks.png");
  --tex-sandstone: url("../assets/textures/sandstone.png");
  --tex-netherrack: url("../assets/textures/netherrack.png");
  --tex-obsidian: url("../assets/textures/obsidian.png");
  --tex-nether-ground: url("../assets/textures/nether_ground.png");
  --tex-letter: url("../assets/textures/sandstone.png");
  --tex-tile: 48px;
}

.theme-nether {
  --surface-card: var(--obsidian); --surface-overlay: #0d0612e6;
  --text-on-dark: #f3e0d0; --text-ink: #f3e0d0; --text-muted: #b98c7a;
  --action-primary: var(--lava); --action-primary-edge: var(--lava-dark);
  --action-secondary: var(--portal); --action-secondary-edge: #6a2f9a;
  --action-reward: var(--gold); --action-reward-edge: var(--gold-dark);
  --tile-face: var(--obsidian); --tile-ink: #f3e0d0;
  --tile-correct: var(--lava); --tile-wrong: #7a1f1f; --tile-active: var(--portal-bright);
  --tex-letter: url("../assets/textures/obsidian.png");
  --progress-track: #2a1410; --progress-fill: var(--lava-bright); --xp-color: var(--gold);
}

.pixelated { image-rendering: pixelated; image-rendering: crisp-edges; }
.block-tex { image-rendering: pixelated; background-repeat: repeat; background-size: var(--tex-tile) var(--tex-tile); }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Add consolidated design-system CSS tokens"
```

---

### Task 4: Logique pure des mots (`src/wordList.js`) + test Vitest

**Files:**
- Create: `src/wordList.js`
- Test: `src/wordList.test.js`

- [ ] **Step 1: Écrire le test (porté depuis le comportement connu de `decouperAuto`/`normaliser` dans `game.js`)**

```js
import { describe, it, expect } from "vitest";
import { normaliser, decouperAuto, prepareList } from "./wordList.js";

describe("decouperAuto", () => {
  it("découpe un mot simple en syllabes V-CV", () => {
    expect(decouperAuto("chien")).toEqual(["chien"]); // pas de 2e noyau vocalique séparé -> ei est un seul noyau
  });
  it("garde les groupes de consonnes inséparables ensemble", () => {
    expect(decouperAuto("fille")).toEqual(["fille"]); // "e" muet final rattaché
  });
  it("coupe au milieu d'un groupe de 2 consonnes séparables", () => {
    expect(decouperAuto("oreilles")).toEqual(["or", "eilles"]);
  });
  it("retourne le mot entier s'il n'y a qu'un seul noyau vocalique", () => {
    expect(decouperAuto("yeux")).toEqual(["yeux"]);
  });
});

describe("normaliser", () => {
  it("accepte une chaîne simple", () => {
    const r = normaliser("ciel");
    expect(r).toEqual({ mot: "ciel", indice: "", syllabes: ["ciel"], nether: false });
  });
  it("respecte les tirets du parent comme découpage syllabes", () => {
    const r = normaliser("fa-mille");
    expect(r.mot).toBe("famille");
    expect(r.syllabes).toEqual(["fa", "mille"]);
  });
  it("accepte un objet avec indice et nether", () => {
    const r = normaliser({ mot: "mi-lieu", indice: "Le centre", nether: true });
    expect(r).toEqual({ mot: "milieu", indice: "Le centre", syllabes: ["mi", "lieu"], nether: true });
  });
});

describe("prepareList", () => {
  it("filtre les entrées vides et garde l'ordre", () => {
    const r = prepareList(["chien", "  ", "fille"]);
    expect(r.map((w) => w.mot)).toEqual(["chien", "fille"]);
  });
});
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue (le module n'existe pas encore)**

Run: `npm run test`
Expected: FAIL — `Cannot find module './wordList.js'`

- [ ] **Step 3: Écrire `src/wordList.js` (porté depuis `game.js`, avec ajout du champ `nether`)**

```js
// Porté depuis l'ancien game.js — même heuristique de découpage syllabes.
// Accepte "mot", "mo-t" (tirets = découpage choisi), ou { mot, indice, nether }.
export function normaliser(entree) {
  const brut = (typeof entree === "string" ? entree : entree.mot || "").trim().toLowerCase();
  const indice = typeof entree === "string" ? "" : entree.indice || "";
  const nether = typeof entree === "string" ? false : !!entree.nether;
  const mot = brut.replace(/-/g, "");
  const syllabes = brut.includes("-")
    ? brut.split("-").filter(Boolean)
    : decouperAuto(mot);
  return { mot, indice, syllabes, nether };
}

const VOYELLES = "aeiouyàâäéèêëïîôöùûüœæ";

export function decouperAuto(mot) {
  const estV = (c) => VOYELLES.includes(c);
  if (mot.length < 2) return [mot];

  const noyaux = [];
  for (let i = 0; i < mot.length; ) {
    if (estV(mot[i])) {
      const d = i;
      while (i < mot.length && estV(mot[i])) i++;
      noyaux.push([d, i - 1]);
    } else i++;
  }
  if (noyaux.length <= 1) return [mot];

  const coupes = [];
  for (let k = 0; k < noyaux.length - 1; k++) {
    const finVoy = noyaux[k][1];
    const cons = mot.slice(finVoy + 1, noyaux[k + 1][0]);
    if (cons.length <= 1) {
      coupes.push(finVoy + cons.length);
    } else {
      const insep =
        (/[bcdfgpqtv]/.test(cons[0]) && /[lr]/.test(cons[1])) ||
        ["ch", "ph", "th", "gn"].includes(cons.slice(0, 2));
      coupes.push(finVoy + (insep ? 1 : 2));
    }
  }

  const syll = [];
  let prev = 0;
  for (const c of coupes) {
    syll.push(mot.slice(prev, c));
    prev = c;
  }
  syll.push(mot.slice(prev));

  if (syll.length > 1) {
    const last = syll[syll.length - 1];
    if (last.endsWith("e") && [...last].filter(estV).length === 1) {
      syll[syll.length - 2] += last;
      syll.pop();
    }
  }
  for (let k = syll.length - 1; k > 0; k--) {
    if (![...syll[k]].some(estV)) {
      syll[k - 1] += syll[k];
      syll.splice(k, 1);
    }
  }
  return syll;
}

export function prepareList(mots) {
  return mots.map(normaliser).filter((m) => m.mot.length > 0);
}
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

Run: `npm run test`
Expected: PASS — tous les tests verts.

- [ ] **Step 5: Commit**

```bash
git add src/wordList.js src/wordList.test.js
git commit -m "Port word normalization and syllable splitting logic, with test coverage"
```

---

### Task 5: Voix (`src/voice.js`)

**Files:**
- Create: `src/voice.js`

- [ ] **Step 1: Écrire le module (porté depuis `game.js`, contournements Chrome inclus)**

```js
// Porté depuis l'ancien game.js. Deux contournements connus du moteur Chrome :
// - le tout premier mot est souvent coupé (moteur "froid") -> amorcerVoix() ;
// - enchaîner cancel() puis speak() tronque le début du mot -> délai de 150ms.
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
let voixFr = null;

function chargerVoix() {
  if (!synth) return;
  const voix = synth.getVoices();
  voixFr =
    voix.find((v) => /^fr/i.test(v.lang) && /google/i.test(v.name)) ||
    voix.find((v) => /fr[-_]?fr/i.test(v.lang)) ||
    voix.find((v) => /^fr/i.test(v.lang)) ||
    null;
}
if (synth) {
  chargerVoix();
  synth.addEventListener("voiceschanged", chargerVoix);
}

export function amorcerVoix() {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  synth.speak(u);
}

function dire(texte, vitesse, surFin) {
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = "fr-FR";
  u.rate = vitesse;
  if (voixFr) u.voice = voixFr;
  if (surFin) u.addEventListener("end", surFin);
  synth.speak(u);
}

export function parler(texte, vitesse = 0.85, surFin) {
  if (!synth) {
    if (surFin) surFin();
    return;
  }
  if (synth.speaking || synth.pending) {
    synth.cancel();
    setTimeout(() => dire(texte, vitesse, surFin), 150);
  } else {
    dire(texte, vitesse, surFin);
  }
}

export function annulerVoix() {
  if (synth) synth.cancel();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/voice.js
git commit -m "Port speech synthesis logic with Chrome workarounds"
```

---

### Task 6: Composants visuels (`src/components/`)

**Files:**
- Create: `src/components/BlockButton.jsx`, `IconButton.jsx`, `LetterTile.jsx`, `SyllableTile.jsx`, `ProgressTrack.jsx`, `HudBar.jsx`, `BlockPanel.jsx`, `Badge.jsx`, `PortalButton.jsx`, `Diamond.jsx`, `McLogo.jsx`, `StepLabel.jsx`, `GroundBackground.jsx`

- [ ] **Step 1: Copier les composants prêts à l'emploi depuis le design system**

Ces fichiers sont déjà du React fonctionnel avec les tokens CSS — copie directe, sans changement de logique :

```bash
cp Les-Mots-Blocs/components/buttons/BlockButton.jsx src/components/
cp Les-Mots-Blocs/components/buttons/IconButton.jsx src/components/
cp Les-Mots-Blocs/components/game/LetterTile.jsx src/components/
cp Les-Mots-Blocs/components/game/SyllableTile.jsx src/components/
cp Les-Mots-Blocs/components/game/ProgressTrack.jsx src/components/
cp Les-Mots-Blocs/components/navigation/HudBar.jsx src/components/
cp Les-Mots-Blocs/components/surfaces/BlockPanel.jsx src/components/
cp Les-Mots-Blocs/components/surfaces/Badge.jsx src/components/
cp Les-Mots-Blocs/components/nether/PortalButton.jsx src/components/
```

- [ ] **Step 2: Corriger les imports relatifs dans `HudBar.jsx`**

`HudBar.jsx` importe `IconButton`, `ProgressTrack`, `Badge` avec des chemins relatifs au design system (`../buttons/IconButton.jsx`, etc.). Comme tous les fichiers sont maintenant à plat dans `src/components/`, ouvrir `src/components/HudBar.jsx` et remplacer :

```js
import { IconButton } from "../buttons/IconButton.jsx";
import { ProgressTrack } from "../game/ProgressTrack.jsx";
import { Badge } from "../surfaces/Badge.jsx";
```
par :
```js
import { IconButton } from "./IconButton.jsx";
import { ProgressTrack } from "./ProgressTrack.jsx";
import { Badge } from "./Badge.jsx";
```

- [ ] **Step 3: Créer `src/components/Diamond.jsx` (icône pixel-art, pas dans `components/`)**

```jsx
import React from "react";
import diamondIcon from "../assets/icons/diamond.png";

export function Diamond({ size = 22, style }) {
  return (
    <img
      src={diamondIcon}
      alt="diamant"
      style={{ width: size, height: size, imageRendering: "pixelated", verticalAlign: "-0.18em", ...style }}
    />
  );
}
```

- [ ] **Step 4: Créer `src/components/McLogo.jsx` (logo extrudé, adapté de `ui_kits/word-game/index.html`)**

```jsx
import React from "react";

export function McLogo({ children, nether = false, style }) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 6vw, 38px)",
        color: nether ? "#ffb070" : "#d2d2d2",
        WebkitTextStroke: nether ? "3px #1a0606" : "3px #15110d",
        paintOrder: "stroke fill",
        textShadow: nether
          ? "0 3px 0 #d4651a, 0 6px 0 #a8460c, 0 9px 0 #6e2b08, 0 12px 0 #3a1404, 0 0 22px #ff6a1f99, 0 15px 12px rgba(0,0,0,.5)"
          : "0 3px 0 #8f8f8f, 0 6px 0 #6c6c6c, 0 9px 0 #4a4a4a, 0 12px 0 #2a2a2a, 0 15px 10px rgba(0,0,0,.45)",
        letterSpacing: 1,
        lineHeight: 1.5,
        margin: 0,
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </h1>
  );
}
```

- [ ] **Step 5: Créer `src/components/StepLabel.jsx`**

```jsx
import React from "react";

export function StepLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "var(--display-lg)",
        color: "var(--cream)",
        textShadow: "var(--text-shadow-pixel)",
        margin: 0,
        textAlign: "center",
        lineHeight: 1.5,
      }}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 6: Créer `src/components/GroundBackground.jsx` (adapté de `Les-Mots-Blocs/ui_kits/word-game/kit-ui.jsx`)**

```jsx
import React from "react";

export function GroundBackground({ nether = false }) {
  if (nether) {
    const embers = Array.from({ length: 9 }, (_, i) => i);
    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: -1, overflow: "hidden",
          background: "radial-gradient(120% 90% at 50% 118%, #b8480c66 0%, #2a0f0c 48%, #160a14 100%)",
        }}
      >
        <div className="block-tex" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "26%", backgroundImage: "var(--tex-netherrack)", backgroundSize: "48px 48px", opacity: 0.85, WebkitMaskImage: "linear-gradient(#000, transparent)", maskImage: "linear-gradient(#000, transparent)" }} />
        <div className="block-tex" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "32%", backgroundImage: "var(--tex-nether-ground)", backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", bottom: "32%", left: 0, right: 0, height: 10, background: "linear-gradient(90deg,#ff7a1f,#ffb43c,#ff5a1f,#ffb43c,#ff7a1f)", boxShadow: "0 0 26px 8px #ff6a1faa, 0 -2px 0 #00000088" }} />
        {embers.map((i) => (
          <span key={i} style={{ position: "absolute", bottom: "30%", left: 8 + i * 11 + "%", width: 4, height: 4, background: i % 2 ? "#ffd07a" : "#ff7a2a", boxShadow: "0 0 6px 2px #ff8a3a88", animation: `ember ${4 + (i % 4)}s linear ${i * 0.6}s infinite` }} />
        ))}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 200px 60px #000a" }} />
      </div>
    );
  }
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "44%", background: "linear-gradient(180deg, var(--sky-top), var(--sky-bottom))" }}>
        <span style={{ position: "absolute", top: "26%", left: "14%", width: 110, height: 26, background: "#ffffffcc", boxShadow: "26px 0 0 #ffffffcc, -20px 14px 0 #ffffffbb, 40px 12px 0 #ffffffbb" }} />
        <span style={{ position: "absolute", top: "52%", left: "66%", width: 84, height: 22, background: "#ffffffbb", boxShadow: "22px 0 0 #ffffffbb, -16px 12px 0 #ffffffaa" }} />
      </div>
      <div className="block-tex" style={{ position: "absolute", top: "44%", left: 0, right: 0, bottom: 0, backgroundColor: "var(--dirt)", backgroundImage: "var(--tex-dirt)", backgroundSize: "48px 48px" }} />
      <div className="block-tex" style={{ position: "absolute", top: "44%", left: 0, right: 0, height: 30, backgroundColor: "var(--grass)", backgroundImage: "var(--tex-grass-top)", backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: "44%", left: 0, right: 0, height: 7, backgroundColor: "var(--grass-light)" }} />
      <div style={{ position: "absolute", top: "calc(44% + 30px)", left: 0, right: 0, height: 16, background: "repeating-linear-gradient(90deg, var(--grass) 0 16px, transparent 16px 32px)" }} />
      <div style={{ position: "absolute", top: "calc(44% + 30px)", left: 0, right: 0, height: 9, background: "repeating-linear-gradient(90deg, transparent 0 16px, var(--grass-dark) 16px 32px)" }} />
    </div>
  );
}
```

Ajouter dans `src/styles/tokens.css` (à la suite des keyframes existantes, ou créer un petit bloc `@keyframes` dédié dans ce fichier) :
```css
@keyframes ember {
  0% { transform: translateY(0); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-70vh); opacity: 0; }
}
```

**Note :** ces fichiers ne sont importés par rien encore (Vite ne les inclura dans le build qu'une fois utilisés par un écran). Leur validité syntaxique sera vérifiée concrètement à la Task 8/9 quand les écrans les importeront réellement — pas besoin d'une vérification à blanc ici.

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "Add visual components ported from the design system"
```

---

### Task 7: Liste de mots (`src/words.js`)

**Files:**
- Create: `src/words.js`

- [ ] **Step 1: Copier le contenu actuel de `words.js` en ajoutant `nether: true` sur 2 mots**

```js
// ===========================================================================
//  LISTE DES MOTS DE DICTÉE
// ===========================================================================
//
//  👉 POUR METTRE À JOUR LA LISTE : modifie simplement le tableau ci-dessous.
//
//  Écrire un mot, 3 possibilités :
//
//    1) Juste le mot (les syllabes sont découpées automatiquement) :
//         "ciel",
//
//    2) Le mot avec des TIRETS là où tu veux couper les syllabes/sons.
//       Utile pour les sons piège ("ille", "eau", "ph"...) que le découpage
//       automatique gère mal. Le tiret n'est qu'une marque : le mot affiché
//       et à écrire reste "famille".
//         "fa-mille",
//
//    3) Avec un petit indice affiché à l'enfant (facultatif), et/ou en le
//       marquant `nether: true` pour qu'il fasse partie de l'épreuve Nether
//       (rappel de mémoire, à la fin) :
//         { mot: "mi-lieu", indice: "Le centre de quelque chose", nether: true },
//
//  Un mot d'une seule syllabe saute l'étape puzzle (rien à reconstruire).
//  Si aucun mot n'est marqué `nether: true`, le portail Nether n'apparaît pas.
// ===========================================================================

export const MOTS = [
  "A-bel",
  "A-man-dine",
  "ci-el",
  { mot: "mi-lieu", indice: "Le centre de quelque chose", nether: true },
  "fa-mille",
  { mot: "fille", nether: true },
  "yeux",
  "or-eilles",
  "chien",
  "pre-mier",
  "pre-mi-ère",
];
```

- [ ] **Step 2: Commit**

```bash
git add src/words.js
git commit -m "Port words list to ES module, tag two example words for Nether mode"
```

---

### Task 8: Écrans hors-Nether (`src/screens/`)

**Files:**
- Create: `src/screens/StartScreen.jsx`, `LearnScreen.jsx`, `SyllablesScreen.jsx`, `WriteScreen.jsx`, `WinScreen.jsx`, `EndScreen.jsx`, `Screen.jsx` (wrapper commun)

- [ ] **Step 1: Créer le wrapper commun `Screen.jsx`**

```jsx
import React from "react";

export function Screen({ children }) {
  return (
    <section
      style={{
        width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", gap: "var(--space-6)",
        animation: "pop var(--t-pop)", textAlign: "center",
      }}
    >
      {children}
    </section>
  );
}
```

Ajouter dans `src/styles/tokens.css` :
```css
@keyframes pop {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

- [ ] **Step 2: `StartScreen.jsx`**

```jsx
import React from "react";
import { Screen } from "./Screen.jsx";
import { McLogo } from "../components/McLogo.jsx";
import { BlockButton } from "../components/BlockButton.jsx";

export function StartScreen({ wordCount, onStart }) {
  return (
    <Screen>
      <McLogo>Les Mots Blocs</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
        Apprends tes mots de dictée bloc par bloc&nbsp;!
      </p>
      {wordCount > 0 ? (
        <p style={{ fontSize: "var(--text-lg)", color: "var(--cream)", margin: 0, opacity: 0.92 }}>
          {wordCount} mots à apprendre aujourd'hui.
        </p>
      ) : (
        <p style={{ fontSize: "var(--text-lg)", color: "var(--cream)", margin: 0 }}>
          ⚠️ La liste de mots est vide (voir words.js).
        </p>
      )}
      <BlockButton variant="primary" size="lg" onClick={onStart} disabled={wordCount === 0}>
        ▶ Commencer
      </BlockButton>
    </Screen>
  );
}
```

- [ ] **Step 3: `LearnScreen.jsx` (écoute + épeler)**

```jsx
import React, { useEffect, useState } from "react";
import { Screen } from "./Screen.jsx";
import { StepLabel } from "../components/StepLabel.jsx";
import { LetterTile } from "../components/LetterTile.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { parler, annulerVoix } from "../voice.js";

export function LearnScreen({ word, nbSteps, onNext }) {
  const [spelling, setSpelling] = useState(-1);

  useEffect(() => {
    parler(word.mot);
  }, [word.mot]);

  function epeler() {
    annulerVoix();
    const lettres = [...word.mot];
    let i = 0;
    const pas = () => {
      if (i >= lettres.length) {
        setSpelling(-1);
        parler(word.mot);
        return;
      }
      setSpelling(i);
      parler(lettres[i], 0.7);
      i++;
      setTimeout(pas, 750);
    };
    pas();
  }

  return (
    <Screen>
      <StepLabel>🔊 Étape 1/{nbSteps} — Écoute le mot</StepLabel>
      {word.indice ? (
        <p style={{ fontStyle: "italic", color: "var(--cream)", opacity: 0.92, fontSize: "var(--text-lg)", margin: 0 }}>
          {word.indice}
        </p>
      ) : null}
      <div style={{ display: "flex", gap: "var(--gap-tiles)", flexWrap: "wrap", justifyContent: "center" }}>
        {[...word.mot].map((l, i) => (
          <LetterTile key={i} letter={l} state={i === spelling ? "active" : "filled"} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--gap-row)", flexWrap: "wrap", justifyContent: "center" }}>
        <BlockButton variant="secondary" onClick={() => parler(word.mot)}>🔊 Écouter</BlockButton>
        <BlockButton variant="secondary" onClick={epeler}>🔤 Épeler</BlockButton>
      </div>
      <BlockButton variant="primary" onClick={onNext}>
        {word.syllabes.length > 1 ? "🧩 Jouer avec les syllabes" : "✏️ Écris le mot"}
      </BlockButton>
    </Screen>
  );
}
```

- [ ] **Step 4: `SyllablesScreen.jsx` (puzzle syllabes)**

Comme dans `game.js`, il faut suivre *quelles tuiles de la banque sont déjà posées* (`posees`), indépendamment de l'ordre où elles ont été cliquées — pas seulement un compteur `placees`.

```jsx
export function SyllablesScreen({ word, onDone, onScore }) {
  const target = word.syllabes;
  const [placees, setPlacees] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const [bank] = useState(() => melanger(target.map((s, idx) => ({ s, idx }))));
  const [posees, setPosees] = useState({}); // { idx: true }
  const [feedback, setFeedback] = useState("");
  const [shakeIdx, setShakeIdx] = useState(-1);
  const termine = useRef(false);

  useEffect(() => {
    parler(word.mot);
  }, [word.mot]);

  function cliquer(item) {
    if (termine.current || posees[item.idx]) return;
    if (item.idx === placees) {
      setPosees((p) => ({ ...p, [item.idx]: true }));
      const np = placees + 1;
      setPlacees(np);
      parler(target[item.idx], 0.8);
      if (np === target.length) {
        termine.current = true;
        const sansFaute = erreurs === 0;
        onScore(5 + (sansFaute ? 5 : 0));
        setFeedback(sansFaute ? "Parfait, sans erreur ! 🌟 +10 💎" : "Bien joué ! 🧩 +5 💎");
        parler(`${sansFaute ? "Parfait" : "Bravo"} ! Tu as trouvé : ${word.mot}`, 0.85, onDone);
      }
    } else {
      setErreurs((e) => e + 1);
      setShakeIdx(item.idx);
      setTimeout(() => setShakeIdx(-1), 350);
      setFeedback("Écoute encore ! 👂");
      parler(word.mot);
    }
  }

  const indiceActif = erreurs >= 3;

  return (
    <Screen>
      <StepLabel>🧩 Étape 2/3 — Reconstruis le mot</StepLabel>
      <BlockButton variant="secondary" size="sm" onClick={() => parler(word.mot)}>🔊 Réécouter</BlockButton>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center", minHeight: 60 }}>
        {target.map((_, i) => (
          <SyllableTile key={i} slot state={i < placees ? "filled" : "default"}>
            {i < placees ? target[i] : ""}
          </SyllableTile>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center", minHeight: 60 }}>
        {bank.map((item) => {
          const isPosee = !!posees[item.idx];
          const isHint = indiceActif && item.idx === placees && !isPosee;
          return (
            <SyllableTile
              key={item.idx}
              state={isPosee ? "disabled" : isHint ? "hint" : "default"}
              onClick={() => cliquer(item)}
              style={shakeIdx === item.idx ? { animation: "shake 0.35s" } : undefined}
            >
              {item.s}
            </SyllableTile>
          );
        })}
      </div>
      <p style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--cream)", minHeight: "1.4em", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
        {feedback}
      </p>
    </Screen>
  );
}
```

Ajouter dans `src/styles/tokens.css` :
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.shake { animation: shake 0.35s; }
```

**Note :** `SyllableTile` (copié en Task 6) gère déjà le clignotement de l'état `"hint"` via une classe interne (`is-hint`) et une balise `<style>` embarquée — rien à ajouter côté tokens pour ça. En revanche, le composant **n'accepte pas de prop `className`** : il fixe lui-même son `className` puis fait `{...rest}`, donc un `className` passé par l'appelant écraserait silencieusement ses classes internes (et casserait le style de base + le clignotement). C'est pour ça que le secouement (`shake`) ci-dessus passe par la prop `style` (correctement fusionnée par le composant), pas par `className`.

- [ ] **Step 5: `WriteScreen.jsx` (réutilisé en mode nether)**

```jsx
import React, { useEffect, useRef, useState } from "react";
import { Screen } from "./Screen.jsx";
import { StepLabel } from "../components/StepLabel.jsx";
import { LetterTile } from "../components/LetterTile.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { parler } from "../voice.js";

export function WriteScreen({ word, label, hint, nether = false, onWin }) {
  const [saisie, setSaisie] = useState("");
  const [shake, setShake] = useState(false);
  const gagne = useRef(false);

  useEffect(() => {
    gagne.current = false;
    setSaisie("");
    if (nether) {
      const t = setTimeout(() => parler(word.mot), 300);
      return () => clearTimeout(t);
    }
  }, [word.mot, nether]);

  useEffect(() => {
    function onKey(e) {
      if (gagne.current) return;
      if (e.key === "Backspace") {
        setSaisie((s) => s.slice(0, -1));
        e.preventDefault();
      } else if (e.key.length === 1 && e.key !== " ") {
        setSaisie((s) => (s.length >= word.mot.length ? s : s + e.key.toLowerCase()));
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [word.mot]);

  useEffect(() => {
    if (saisie.length !== word.mot.length) return;
    if (saisie === word.mot) {
      gagne.current = true;
      setTimeout(onWin, 350);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
  }, [saisie, word.mot, onWin]);

  const feedback = saisie.length === word.mot.length && saisie !== word.mot ? "Presque ! Corrige les blocs rouges 🔴" : "";

  return (
    <Screen>
      <StepLabel>{label}</StepLabel>
      <BlockButton variant="secondary" size="sm" onClick={() => parler(word.mot)}>🔊 Réécouter</BlockButton>
      <div className={shake ? "shake" : ""} style={{ display: "flex", gap: "var(--gap-tiles)", flexWrap: "wrap", justifyContent: "center" }}>
        {[...word.mot].map((l, i) => {
          const tape = saisie[i];
          const state = tape === undefined ? "empty" : tape === l ? "good" : "bad";
          return <LetterTile key={i} letter={tape} state={state} />;
        })}
      </div>
      <p style={{ fontSize: "var(--text-md)", fontStyle: "italic", color: "var(--cream)", opacity: 0.9, margin: 0 }}>
        {feedback || hint}
      </p>
    </Screen>
  );
}
```

**Note :** la vraie écriture (non-nether) ne montre **pas** les blocs-lettres cachés du mot pendant la saisie — comparer à `game.js` : `construireBlocs(... { caches: true })` affiche bien des cases vides de la longueur du mot, ce que `LetterTile state="empty"` reproduit déjà (case vide visible). C'est donc correct pour les deux modes : seule la *consigne textuelle* (`hint`) change entre nether et non-nether, pas le rendu des tuiles — conforme à la spec (« pas de blocs-lettres affichés... » fait référence à l'absence d'indices visuels sur les lettres avant saisie, ce qui est déjà le cas par défaut).

- [ ] **Step 6: `WinScreen.jsx`**

```jsx
import React, { useEffect } from "react";
import { Screen } from "./Screen.jsx";
import { McLogo } from "../components/McLogo.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { Diamond } from "../components/Diamond.jsx";
import { parler } from "../voice.js";

export function WinScreen({ word, onNext }) {
  useEffect(() => {
    parler("Bravo !");
  }, []);

  return (
    <Screen>
      <div style={{ fontSize: 72, animation: "bob 1s ease-in-out infinite" }}>🎉</div>
      <McLogo style={{ fontSize: "var(--display-xl)" }}>BRAVO !</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
        Tu as écrit «&nbsp;{word.mot}&nbsp;» !
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--display-md)", color: "var(--diamond)", textShadow: "var(--text-shadow-pixel)", margin: 0, display: "inline-flex", gap: 8, alignItems: "center" }}>
        +10 <Diamond size={20} />
      </p>
      <BlockButton variant="reward" onClick={onNext}>Mot suivant ➡</BlockButton>
    </Screen>
  );
}
```

Ajouter dans `src/styles/tokens.css` :
```css
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
```

- [ ] **Step 7: `EndScreen.jsx` (avec portail Nether conditionnel)**

```jsx
import React, { useEffect } from "react";
import { Screen } from "./Screen.jsx";
import { McLogo } from "../components/McLogo.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { PortalButton } from "../components/PortalButton.jsx";
import { Diamond } from "../components/Diamond.jsx";
import { parler } from "../voice.js";

export function EndScreen({ xp, wordCount, hasNether, onReplay, onNether }) {
  useEffect(() => {
    parler("Félicitations ! Tu as réussi tous les mots !");
  }, []);

  return (
    <Screen>
      <div style={{ fontSize: 80, animation: "bob 1s ease-in-out infinite" }}>🏆</div>
      <McLogo style={{ fontSize: "var(--display-xl)" }}>Mots réussis !</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, display: "inline-flex", gap: 8, alignItems: "center", textShadow: "var(--text-shadow-pixel-sm)" }}>
        Tu as gagné {xp} <Diamond size={22} /> sur {wordCount} mots !
      </p>
      <BlockButton variant="primary" onClick={onReplay}>🔁 Rejouer</BlockButton>
      {hasNether ? (
        <div style={{ marginTop: "var(--space-6)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}>
          <p style={{ fontSize: "var(--text-md)", color: "var(--cream)", opacity: 0.85, margin: 0, maxWidth: 380 }}>
            Prêt pour l'épreuve&nbsp;? Écris les mots <strong>de mémoire</strong>, rien qu'avec le son…
          </p>
          <PortalButton onClick={onNether}>🔥 Entrer dans le Nether</PortalButton>
        </div>
      ) : null}
    </Screen>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/screens
git commit -m "Add overworld screens (start, learn, syllables, write, win, end)"
```

---

### Task 9: Écrans Nether (`src/screens/nether/`)

**Files:**
- Create: `src/screens/nether/NetherIntroScreen.jsx`, `NetherFlashScreen.jsx`, `NetherEndScreen.jsx`

- [ ] **Step 1: `NetherIntroScreen.jsx`**

```jsx
import React, { useEffect } from "react";
import { Screen } from "../Screen.jsx";
import { McLogo } from "../../components/McLogo.jsx";
import { PortalButton } from "../../components/PortalButton.jsx";
import { parler } from "../../voice.js";

export function NetherIntroScreen({ onStart }) {
  useEffect(() => {
    parler("Bienvenue dans le Nether. Écris les mots de mémoire.");
  }, []);

  return (
    <Screen>
      <div style={{ fontSize: 64, animation: "bob 1.2s ease-in-out infinite" }}>🔥</div>
      <McLogo nether style={{ fontSize: "var(--display-xl)" }}>Le Nether</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "#f3e0d0", margin: 0, maxWidth: 420, textShadow: "0 0 10px #ff6a1f88" }}>
        Pas de blocs pour t'aider. Écoute bien… puis écris le mot <strong>de mémoire</strong>.
      </p>
      <PortalButton onClick={onStart}>🔥 Commencer l'épreuve</PortalButton>
    </Screen>
  );
}
```

- [ ] **Step 2: `NetherFlashScreen.jsx`**

```jsx
import React from "react";
import { Screen } from "../Screen.jsx";
import { McLogo } from "../../components/McLogo.jsx";
import { Diamond } from "../../components/Diamond.jsx";

export function NetherFlashScreen({ word }) {
  return (
    <Screen>
      <div style={{ fontSize: 64, animation: "bob 0.8s ease-in-out infinite" }}>🔥</div>
      <McLogo nether style={{ fontSize: "var(--display-lg)" }}>De mémoire !</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "#ffd07a", margin: 0, display: "inline-flex", gap: 8, alignItems: "center" }}>
        «&nbsp;{word.mot}&nbsp;» — +15 <Diamond size={20} />
      </p>
    </Screen>
  );
}
```

- [ ] **Step 3: `NetherEndScreen.jsx`**

```jsx
import React, { useEffect } from "react";
import { Screen } from "../Screen.jsx";
import { McLogo } from "../../components/McLogo.jsx";
import { BlockButton } from "../../components/BlockButton.jsx";
import { Diamond } from "../../components/Diamond.jsx";
import { parler } from "../../voice.js";

export function NetherEndScreen({ wordsOk, onExit }) {
  useEffect(() => {
    parler("Incroyable ! Tu as vaincu le Nether !");
  }, []);

  const xpNether = wordsOk * 15;

  return (
    <Screen>
      <div style={{ fontSize: 84, animation: "bob 1s ease-in-out infinite" }}>🏆</div>
      <McLogo nether style={{ fontSize: "var(--display-xl)" }}>Nether vaincu !</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "#ffd07a", margin: 0, display: "inline-flex", gap: 8, alignItems: "center", textShadow: "0 0 10px #ff6a1f66" }}>
        {xpNether} <Diamond size={22} /> gagnés de mémoire&nbsp;!
      </p>
      <BlockButton variant="reward" onClick={onExit}>↩ Retour à l'Overworld</BlockButton>
    </Screen>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/screens/nether
git commit -m "Add Nether recall-mode screens"
```

---

### Task 10: State machine (`src/App.jsx`)

**Files:**
- Modify: `src/App.jsx`
- Create: `src/index.css` (styles globaux : fond, `.theme-nether`, import des tokens)

- [ ] **Step 1: Créer `src/index.css`**

```css
@import "./styles/tokens.css";

* { box-sizing: border-box; }

html, body, #root {
  margin: 0;
  min-height: 100vh;
}

body {
  font-family: var(--font-text);
  color: var(--cream);
}
```

- [ ] **Step 2: Importer ce fichier dans `src/main.jsx`**

Vérifier/éditer `src/main.jsx` pour qu'il importe `./index.css` (le template Vite l'a probablement déjà en `index.css` par défaut — remplacer son contenu plutôt que dupliquer l'import).

- [ ] **Step 3: Écrire `src/App.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { MOTS } from "./words.js";
import { prepareList } from "./wordList.js";
import { amorcerVoix } from "./voice.js";
import { GroundBackground } from "./components/GroundBackground.jsx";
import { HudBar } from "./components/HudBar.jsx";
import { StartScreen } from "./screens/StartScreen.jsx";
import { LearnScreen } from "./screens/LearnScreen.jsx";
import { SyllablesScreen } from "./screens/SyllablesScreen.jsx";
import { WriteScreen } from "./screens/WriteScreen.jsx";
import { WinScreen } from "./screens/WinScreen.jsx";
import { EndScreen } from "./screens/EndScreen.jsx";
import { NetherIntroScreen } from "./screens/nether/NetherIntroScreen.jsx";
import { NetherFlashScreen } from "./screens/nether/NetherFlashScreen.jsx";
import { NetherEndScreen } from "./screens/nether/NetherEndScreen.jsx";

const MOTS_LISTE = prepareList(MOTS);
const MOTS_NETHER = MOTS_LISTE.filter((m) => m.nether);

export default function App() {
  const [mode, setMode] = useState("overworld"); // 'overworld' | 'nether'
  const [phase, setPhase] = useState("start");
  const [index, setIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [netherIndex, setNetherIndex] = useState(0);
  const [netherWordsOk, setNetherWordsOk] = useState(0);

  const isNether = mode === "nether";
  const word = isNether ? MOTS_NETHER[netherIndex] : MOTS_LISTE[index];
  const nbEtapes = word && word.syllabes.length > 1 ? 3 : 2;
  const showHud = !["start", "end", "n-intro", "n-end"].includes(phase);
  const canGoBack = phase === "write" || phase === "syll" || (phase === "learn" && index > 0);

  function commencer() {
    amorcerVoix();
    setIndex(0);
    setXp(0);
    setPhase("learn");
  }

  function retour() {
    if (phase === "write") setPhase(word.syllabes.length > 1 ? "syll" : "learn");
    else if (phase === "syll") setPhase("learn");
    else if (phase === "learn" && index > 0) {
      setIndex(index - 1);
      setPhase("learn");
    }
  }

  function versEtapeSuivante() {
    setPhase(word.syllabes.length > 1 ? "syll" : "write");
  }

  function gagnerMot() {
    setXp((x) => x + 10);
    setPhase("win");
  }

  function motSuivant() {
    if (index + 1 >= MOTS_LISTE.length) setPhase("end");
    else {
      setIndex(index + 1);
      setPhase("learn");
    }
  }

  function recommencer() {
    setIndex(0);
    setXp(0);
    setNetherIndex(0);
    setNetherWordsOk(0);
    setMode("overworld");
    setPhase("learn");
  }

  function entrerNether() {
    setMode("nether");
    setNetherIndex(0);
    setNetherWordsOk(0);
    setPhase("n-intro");
  }

  function demarrerNether() {
    setPhase("n-write");
  }

  function gagnerMotNether() {
    setNetherWordsOk((n) => n + 1);
    setPhase("n-flash");
  }

  useEffect(() => {
    if (phase !== "n-flash") return;
    const t = setTimeout(() => {
      if (netherIndex + 1 >= MOTS_NETHER.length) setPhase("n-end");
      else {
        setNetherIndex(netherIndex + 1);
        setPhase("n-write");
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, netherIndex]);

  function sortirNether() {
    setMode("overworld");
    setPhase("start");
  }

  const hudIndex = isNether ? netherIndex : index;
  const hudTotal = isNether ? MOTS_NETHER.length : MOTS_LISTE.length;

  return (
    <div
      className={isNether ? "theme-nether" : undefined}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <GroundBackground nether={isNether} />
      {showHud && (
        <HudBar index={hudIndex} total={hudTotal} xp={xp} canGoBack={canGoBack} onBack={retour} />
      )}
      <main
        style={{
          width: "100%", maxWidth: "var(--content-max)", flex: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "var(--pad-screen)",
        }}
      >
        {phase === "start" && <StartScreen wordCount={MOTS_LISTE.length} onStart={commencer} />}
        {phase === "learn" && <LearnScreen key={index} word={word} nbSteps={nbEtapes} onNext={versEtapeSuivante} />}
        {phase === "syll" && (
          <SyllablesScreen key={index} word={word} onDone={() => setPhase("write")} onScore={(n) => setXp((x) => x + n)} />
        )}
        {phase === "write" && (
          <WriteScreen
            key={index}
            word={word}
            label={`⛏️ Étape ${nbEtapes}/${nbEtapes} — Écris le mot`}
            hint="⌨️ Tape le mot au clavier (Retour arrière pour corriger)"
            onWin={gagnerMot}
          />
        )}
        {phase === "win" && <WinScreen word={word} onNext={motSuivant} />}
        {phase === "end" && (
          <EndScreen
            xp={xp}
            wordCount={MOTS_LISTE.length}
            hasNether={MOTS_NETHER.length > 0}
            onReplay={recommencer}
            onNether={entrerNether}
          />
        )}

        {phase === "n-intro" && <NetherIntroScreen onStart={demarrerNether} />}
        {phase === "n-write" && (
          <WriteScreen
            key={"n" + netherIndex}
            word={word}
            nether
            label="🔊 Écoute et écris de mémoire"
            hint="Aucun bloc ne t'aide ici. Tape ce que tu entends."
            onWin={gagnerMotNether}
          />
        )}
        {phase === "n-flash" && <NetherFlashScreen word={word} />}
        {phase === "n-end" && <NetherEndScreen wordsOk={netherWordsOk} onExit={sortirNether} />}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Vérifier `src/main.jsx`**

Doit ressembler à :
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: Lancer le serveur de dev et vérifier manuellement la boucle complète**

Run: `npm run dev`

Vérifier dans le navigateur :
- Écran d'accueil : nombre de mots affiché, bouton « Commencer ».
- Écoute : mot prononcé, indice affiché si présent, bouton Épeler (surlignage lettre par lettre), bouton suivant adapté (syllabes ou écriture selon le mot).
- Syllabes : reconstruction, erreur => secousse + « Écoute encore ! 👂 », indice clignotant après 3 erreurs, bonus si sans faute, enchaînement automatique vers l'écriture.
- Écriture : taper au clavier sans cliquer nulle part, lettres vertes/rouges, mot complet correct → écran Bravo, mot incomplet faux → secousse + message.
- Flèche retour : visible/masquée selon les règles (masquée sur le 1er mot en écoute, sur win/end).
- Fin de liste → écran final avec score, bouton Rejouer, et bouton portail Nether visible (car 2 mots sont tagués `nether: true` dans `words.js`).
- Nether : intro → écriture sans aide visuelle (juste le son) → flash de validation +15💎 → écran de fin Nether avec total → retour à l'accueil.
- Rejouer depuis l'écran de fin remet tout à zéro (xp, index, état Nether).

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/main.jsx src/index.css
git commit -m "Wire up game state machine with overworld and Nether flow"
```

---

### Task 11: Nettoyage des anciens fichiers vanilla

**Files:**
- Delete: anciens `style.css`, `game.js`, `words.js` (racine), si le scaffold Vite a généré un `index.html` séparé en plus de l'ancien (vérifier qu'il n'y a qu'un seul `index.html` à la racine, celui généré par Vite)
- Modify: `index.html` (vérifier le `<title>` reste `Les Mots Blocs ⛏️`)

- [ ] **Step 1: Vérifier qu'aucun fichier React n'importe encore les anciens fichiers**

Run: `grep -rn "game.js\|words.js\|style.css" index.html src/ --include="*.jsx" --include="*.js" --include="*.html" 2>/dev/null`
Expected: aucune référence aux anciens fichiers vanilla (seul `src/words.js` doit apparaître, ce qui est attendu).

- [ ] **Step 2: Supprimer les anciens fichiers vanilla à la racine**

```bash
git rm style.css game.js
```
(`words.js` à la racine a probablement déjà été remplacé par le `words.js` généré par le scaffold Vite dans `src/` — vérifier qu'il n'existe plus de `words.js` à la racine du repo ; sinon le supprimer aussi avec `git rm words.js`.)

- [ ] **Step 3: Vérifier le titre de la page dans `index.html`**

Ouvrir `index.html` (racine, généré par Vite) et s'assurer que `<title>` contient `Les Mots Blocs ⛏️` (le template Vite met probablement un titre générique à corriger).

- [ ] **Step 4: Relancer le build complet pour confirmer qu'il n'y a pas de référence cassée**

Run: `npm run build`
Expected: build réussit sans erreur.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Remove obsolete vanilla JS/CSS files now superseded by the React app"
```

---

### Task 12: Mettre à jour `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Mettre à jour la section « Stack & architecture »**

Remplacer la description « HTML + CSS + JavaScript pur, sans framework ni build » et la liste de fichiers à plat par une description Vite+React reflétant la nouvelle architecture (`src/App.jsx`, `src/words.js`, `src/wordList.js`, `src/voice.js`, `src/screens/`, `src/components/`), en gardant le ton et la structure générale du document existant. Préciser que `words.js` (désormais `src/words.js`) reste le seul fichier que le parent édite, avec le nouveau champ `nether: true` documenté.

- [ ] **Step 2: Mettre à jour la section « Lancer / tester »**

Remplacer « **Ouvrir `index.html`** directement... `file://` fonctionne » (devenu faux) par :
```markdown
### Lancer / tester

Projet Vite+React : `npm install` puis `npm run dev` pour lancer en local
(`http://localhost:5173`), `npm run build` pour produire un build statique
dans `dist/` (nécessite un serveur HTTP pour être ouvert, pas de `file://`
direct — modules ES). Pas de back-end, pas de compte.

`npm run test` lance les tests Vitest (logique pure de découpage syllabes
dans `src/wordList.test.js`). Pas de tests UI automatisés : vérifier les
changements en jouant la boucle dans le navigateur.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md to document the Vite+React architecture"
```

---

### Task 13: Vérification finale

**Files:** aucun changement de code — vérification seulement.

- [ ] **Step 1: Lancer la suite de tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 2: Build de production**

Run: `npm run build`
Expected: succès, dossier `dist/` généré.

- [ ] **Step 3: Servir le build et vérifier dans le navigateur**

Run: `npx serve dist` (ou `npx http-server dist -p 8731 -c-1`)
Ouvrir l'URL indiquée, rejouer la boucle complète overworld + Nether décrite à la Task 10 Step 5.

- [ ] **Step 4: Vérifier le cas liste de mots vide**

Modifier temporairement `src/words.js` pour exporter `export const MOTS = [];`, relancer `npm run dev`, vérifier le message d'avertissement et le bouton désactivé sur `StartScreen`. **Annuler ce changement** avant de continuer (`git checkout -- src/words.js` ou restaurer manuellement le contenu de la Task 7).
