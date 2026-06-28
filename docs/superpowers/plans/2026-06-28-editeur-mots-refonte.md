# Refonte de l'éditeur de mots — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre l'éditeur de mots en tableau, ajouter un bouton Reset confirmé (différé) et la possibilité de mettre un mot de côté (désactiver/réactiver) sans le supprimer.

**Architecture:** Un champ booléen `actif` est ajouté à chaque entrée de config (défaut `true`, rétrocompatible). `App` filtre les inactifs hors de `motsListe` (donc hors jeu ET hors Nether). `WordEditor` est réécrit en tableau HTML avec une section « Mots de côté » sous la liste active.

**Tech Stack:** Vite + React 19 (JS, pas TS), Vitest (environnement node, tests de logique pure).

Spec de référence : `docs/superpowers/specs/2026-06-28-editeur-mots-refonte-design.md`

---

## Structure des fichiers

- `src/config.js` — **modifié** : `actif` dans `toEntry` et `saveConfig`.
- `src/config.test.js` — **créé** : tests purs du modèle (`actif`, round-trip, rétrocompat).
- `src/App.jsx` — **modifié** (1 ligne) : filtrer les inactifs dans `motsListe`.
- `src/screens/WordEditor.jsx` — **réécrit** : tableau + Mots de côté + désactiver/réactiver + Reset confirmé.
- `CLAUDE.md` — **modifié** : description de l'éditeur mise à jour.

---

## Task 1 : Champ `actif` dans le modèle de config (TDD)

**Files:**
- Modify: `src/config.js`
- Test: `src/config.test.js` (create)

- [ ] **Step 1 : Écrire le test qui échoue**

Create `src/config.test.js` :

```js
import { describe, it, expect, beforeEach } from "vitest";
import { defaultMots, loadConfig, saveConfig } from "./config.js";

// Vitest tourne en environnement node : pas de localStorage natif.
// On installe un mock minimal en mémoire avant chaque test.
beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
});

describe("config : champ actif", () => {
  it("defaultMots met actif:true partout", () => {
    expect(defaultMots().every((m) => m.actif === true)).toBe(true);
  });

  it("saveConfig puis loadConfig conserve actif:false", () => {
    saveConfig({
      prenom: "Léa",
      mots: [
        { mot: "chat", indice: "", nether: false, actif: true },
        { mot: "souris", indice: "", nether: false, actif: false },
      ],
    });
    const cfg = loadConfig();
    expect(cfg.prenom).toBe("Léa");
    expect(cfg.mots.map((m) => m.actif)).toEqual([true, false]);
  });

  it("une entrée persistée sans actif est considérée active (rétrocompat)", () => {
    localStorage.setItem(
      "motsblocs-config-v1",
      JSON.stringify({ prenom: "", mots: [{ mot: "chat", indice: "", nether: false }] })
    );
    expect(loadConfig().mots[0].actif).toBe(true);
  });
});
```

- [ ] **Step 2 : Lancer le test, vérifier l'échec**

Run: `npm run test`
Expected: les 3 nouveaux tests ÉCHOUENT (`actif` est `undefined`).

- [ ] **Step 3 : Implémenter le minimum dans `src/config.js`**

Dans `toEntry`, ajouter `actif` :

```js
function toEntry(m) {
  return typeof m === "string"
    ? { mot: m, indice: "", nether: false, actif: true }
    : { mot: m.mot || "", indice: m.indice || "", nether: !!m.nether, actif: m.actif !== false };
}
```

Dans `saveConfig`, persister `actif` :

```js
const clean = mots.map(({ mot, indice, nether, actif }) => ({
  mot,
  indice,
  nether,
  actif: actif !== false,
}));
```

- [ ] **Step 4 : Lancer les tests, vérifier qu'ils passent**

Run: `npm run test`
Expected: tous les tests PASSENT (les 8 existants + les 3 nouveaux).

- [ ] **Step 5 : Commit**

```bash
git add src/config.js src/config.test.js
git commit -m "Ajouter le champ actif au modèle de config (mots de côté)"
```

---

## Task 2 : Exclure les mots inactifs du jeu (`App.jsx`)

**Files:**
- Modify: `src/App.jsx:30`

Pas de test automatisé (logique dans un composant). Vérification manuelle en Task 5.

- [ ] **Step 1 : Modifier le calcul de `motsListe`**

Remplacer :

```js
const motsListe = useMemo(() => prepareList(entrees), [entrees]);
```

par :

```js
const motsListe = useMemo(
  () => prepareList(entrees.filter((e) => e.actif !== false)),
  [entrees]
);
```

(`motsNether`, `wordCount` et tout le reste en découlent automatiquement : les inactifs sont exclus du jeu et du Nether.)

- [ ] **Step 2 : Vérifier que le build/les tests ne cassent pas**

Run: `npm run test`
Expected: PASS (inchangé). `npm run build` doit aussi réussir.

- [ ] **Step 3 : Commit**

```bash
git add src/App.jsx
git commit -m "Exclure les mots désactivés du jeu et du Nether"
```

---

## Task 3 : Réécrire `WordEditor` en tableau + Mots de côté + Reset

**Files:**
- Modify (réécriture complète) : `src/screens/WordEditor.jsx`

Pas de test automatisé (UI). Vérification manuelle en Task 5.

- [ ] **Step 1 : Remplacer le contenu de `src/screens/WordEditor.jsx`**

```jsx
import React, { useState } from "react";
import { BlockButton } from "../components/BlockButton.jsx";
import { normaliser } from "../wordList.js";
import { defaultMots } from "../config.js";

let _seq = 0;
const uid = () => `row-${++_seq}`;
const withIds = (mots) =>
  mots.map((m) => ({
    id: uid(),
    mot: m.mot,
    indice: m.indice,
    nether: m.nether,
    actif: m.actif !== false,
  }));

function apercuSyllabes(mot) {
  const syll = normaliser({ mot }).syllabes.filter(Boolean);
  return syll.length ? syll.join(" · ") : "";
}

const inputStyle = {
  fontFamily: "inherit", fontSize: "var(--text-md)", padding: "8px 10px",
  border: "2px solid var(--ink-soft)", borderRadius: "var(--radius)",
  background: "#fff", color: "var(--ink)", width: "100%", boxSizing: "border-box",
};
const cellStyle = { padding: "6px 6px", verticalAlign: "top" };
const iconBtn = {
  cursor: "pointer", background: "none", border: "none", fontSize: 20, padding: "2px 4px", lineHeight: 1,
};
const arrowBtn = (disabled) => ({
  cursor: disabled ? "default" : "pointer", lineHeight: 1, fontSize: 12, padding: "2px 5px",
  border: "2px solid var(--ink-soft)", borderRadius: "var(--radius)", background: "#fff",
  color: "var(--ink)", opacity: disabled ? 0.35 : 1,
});

// Éditeur de la liste de mots, ouvert depuis l'accueil. Tableau (1 ligne = 1
// mot) réordonnable (poignée ☰ + ▲▼), aperçu en direct du découpage syllabes,
// champ indice et case 🔥 Nether par mot. ⏸ met un mot « de côté » (désactivé,
// hors jeu/Nether) : il descend dans la section « Mots de côté », d'où on peut
// le ▶ Réactiver. ↺ Reset recharge la liste par défaut (effectif au Valider).
export function WordEditor({ entrees, prenom, onValidate, onClose }) {
  const [rows, setRows] = useState(() => withIds(entrees));
  const [name, setName] = useState(prenom);
  const [dragId, setDragId] = useState(null);

  const actifs = rows.filter((r) => r.actif !== false);
  const inactifs = rows.filter((r) => r.actif === false);

  function maj(id, champ, valeur) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [champ]: valeur } : r)));
  }
  function supprimer(id) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }
  function ajouter() {
    setRows((rs) => [...rs, { id: uid(), mot: "", indice: "", nether: false, actif: true }]);
  }
  function mettreDeCote(id) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, actif: false } : r)));
  }
  function reactiver(id) {
    // repasse actif et déplace la ligne en fin de liste active
    setRows((rs) => {
      const r = rs.find((x) => x.id === id);
      if (!r) return rs;
      return [...rs.filter((x) => x.id !== id), { ...r, actif: true }];
    });
  }
  // ▲▼ : échange avec le voisin ACTIF (saute les inactifs intercalés)
  function deplacer(id, delta) {
    setRows((rs) => {
      const i = rs.findIndex((r) => r.id === id);
      if (i < 0) return rs;
      let j = i + delta;
      while (j >= 0 && j < rs.length && rs[j].actif === false) j += delta;
      if (j < 0 || j >= rs.length || rs[j].actif === false) return rs;
      const next = rs.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function reset() {
    const ok = window.confirm(
      "Remettre la liste de mots par défaut ? Tes réglages actuels seront remplacés (effectif après Valider)."
    );
    if (!ok) return;
    setRows(withIds(defaultMots()));
  }

  function surGlisser(e, overId) {
    e.preventDefault();
    if (dragId == null || dragId === overId) return;
    setRows((rs) => {
      const from = rs.findIndex((r) => r.id === dragId);
      const to = rs.findIndex((r) => r.id === overId);
      if (from < 0 || to < 0 || rs[to].actif === false) return rs; // cible active seulement
      const next = rs.slice();
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  }

  function valider() {
    const propres = rows.filter((r) => r.mot.trim());
    onValidate(
      propres.map((r) => ({
        mot: r.mot.trim(), indice: r.indice.trim(), nether: r.nether, actif: r.actif !== false,
      })),
      name.trim()
    );
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "var(--space-4)", overflowY: "auto" }}
    >
      <div style={{ width: "100%", maxWidth: 600, margin: "var(--space-6) 0", background: "var(--cream)", color: "var(--ink)", border: "4px solid var(--ink)", borderRadius: "var(--radius)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", margin: 0, fontSize: "var(--display-md)", color: "var(--ink)" }}>⚙️ Réglages des mots</h2>

        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700 }}>
          Prénom de l'enfant
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="(facultatif)" />
        </label>

        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
          Glisse la poignée <strong>☰</strong> (ou ▲▼) pour changer l'ordre. Ajoute un <strong>tiret</strong> dans
          le mot seulement si le découpage en syllabes affiché (→) est faux : ex. <em>mi-lieu</em>.
          Coche <strong>🔥</strong> pour le <strong>bonus Nether</strong>. <strong>⏸</strong> met un mot de côté
          (gardé mais hors jeu) ; <strong>🗑️</strong> le supprime.
        </p>

        <h3 style={{ margin: 0, fontSize: "var(--text-lg)", color: "var(--ink)" }}>Mots actifs ({actifs.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {actifs.map((r, idx) => (
                <tr
                  key={r.id}
                  onDragOver={(e) => surGlisser(e, r.id)}
                  onDrop={(e) => e.preventDefault()}
                  style={{ background: dragId === r.id ? "#ffe9b0" : "transparent", borderBottom: "2px solid var(--ink-soft)" }}
                >
                  <td style={cellStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span
                        draggable
                        onDragStart={() => setDragId(r.id)}
                        onDragEnd={() => setDragId(null)}
                        title="Glisser pour réordonner"
                        style={{ cursor: "grab", fontSize: 18, userSelect: "none" }}
                      >
                        ☰
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <button type="button" onClick={() => deplacer(r.id, -1)} disabled={idx === 0} title="Monter" style={arrowBtn(idx === 0)}>▲</button>
                        <button type="button" onClick={() => deplacer(r.id, 1)} disabled={idx === actifs.length - 1} title="Descendre" style={arrowBtn(idx === actifs.length - 1)}>▼</button>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...cellStyle, minWidth: 140 }}>
                    <input style={inputStyle} value={r.mot} onChange={(e) => maj(r.id, "mot", e.target.value)} placeholder="mot (ex: mi-lieu)" />
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", minHeight: "1.2em" }}>
                      {r.mot.trim() ? `→ ${apercuSyllabes(r.mot)}` : ""}
                    </div>
                  </td>
                  <td style={{ ...cellStyle, minWidth: 120 }}>
                    <input style={inputStyle} value={r.indice} onChange={(e) => maj(r.id, "indice", e.target.value)} placeholder="indice (facultatif)" />
                  </td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    <label title="Mot du bonus Nether (rappel de mémoire en fin de partie)" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                      <input type="checkbox" checked={r.nether} onChange={(e) => maj(r.id, "nether", e.target.checked)} /> 🔥
                    </label>
                  </td>
                  <td style={{ ...cellStyle, whiteSpace: "nowrap", textAlign: "right" }}>
                    <button type="button" onClick={() => mettreDeCote(r.id)} title="Mettre de côté" style={iconBtn}>⏸</button>
                    <button type="button" onClick={() => supprimer(r.id)} title="Supprimer" style={iconBtn}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inactifs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-lg)", color: "var(--ink-soft)" }}>Mots de côté ({inactifs.length})</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {inactifs.map((r) => (
                <li key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", border: "2px dashed var(--ink-soft)", borderRadius: "var(--radius)", background: "rgba(0,0,0,0.04)" }}>
                  <span style={{ flex: 1, color: "var(--ink-soft)", textDecoration: "line-through" }}>{r.mot || "(vide)"}</span>
                  <BlockButton variant="secondary" size="sm" onClick={() => reactiver(r.id)}>▶ Réactiver</BlockButton>
                  <button type="button" onClick={() => supprimer(r.id)} title="Supprimer" style={iconBtn}>🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <BlockButton variant="secondary" size="sm" onClick={ajouter}>➕ Ajouter un mot</BlockButton>
          <BlockButton variant="neutral" size="sm" onClick={reset}>↺ Reset</BlockButton>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "var(--space-2)" }}>
          <BlockButton variant="neutral" onClick={onClose}>Annuler</BlockButton>
          <BlockButton variant="primary" onClick={valider}>✅ Valider</BlockButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Vérifier que le build passe**

Run: `npm run build`
Expected: build OK, aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/screens/WordEditor.jsx
git commit -m "Refonte de l'éditeur de mots en tableau + mots de côté + Reset"
```

---

## Task 4 : Mettre à jour la documentation (`CLAUDE.md`)

**Files:**
- Modify: `CLAUDE.md` (description de `WordEditor` dans la liste des écrans)

- [ ] **Step 1 : Mettre à jour la phrase décrivant `WordEditor`**

Dans la section « Fichiers principaux », remplacer la description de `WordEditor`
(actuellement : « l'éditeur de mots (modal ⚙️) … réordonnancement par
glisser-déposer, aperçu syllabes en direct, champ indice + case Nether par mot,
prénom de l'enfant ; il applique à la validation ») par une formulation qui
mentionne : présentation en **tableau** (1 ligne = 1 mot), section **« Mots de
côté »** pour désactiver/réactiver un mot sans le supprimer (un mot de côté est
exclu du jeu et du Nether via le filtre `actif` dans `App`), et bouton **Reset**
(recharge `words.js`, effectif au Valider).

Ajouter aussi, dans les « Conventions importantes », une note brève : le modèle
de config porte un champ `actif` (défaut `true`, rétrocompatible) et `App` dérive
`motsListe` de `prepareList(entrees.filter(e => e.actif !== false))`.

- [ ] **Step 2 : Commit**

```bash
git add CLAUDE.md
git commit -m "Doc : éditeur de mots en tableau, mots de côté, champ actif"
```

---

## Task 5 : Vérification manuelle (navigateur)

**Files:** aucun (vérification)

- [ ] **Step 1 : Lancer l'app**

Run: `npm run dev` puis ouvrir `http://localhost:5173`.

- [ ] **Step 2 : Dérouler la checklist**

- [ ] Ouvrir ⚙️ : la liste s'affiche en **tableau**, 1 ligne par mot, lisible.
- [ ] Réordonner avec ▲▼ et par glisser : l'ordre change, les bornes grisent les flèches.
- [ ] Cliquer ⏸ sur un mot : il descend dans **« Mots de côté »**.
- [ ] Le compteur « Mots actifs (n) » diminue ; le compteur d'accueil aussi après Valider.
- [ ] **Réactiver** un mot de côté : il revient en bas de la liste active.
- [ ] Valider, puis lancer une partie : le mot de côté **n'apparaît pas** dans le jeu, ni dans le Nether (si tagué 🔥).
- [ ] Rouvrir ⚙️, cliquer **↺ Reset** → confirmer : la liste redevient celle de `words.js`. **Annuler** (sans Valider) → la liste précédente est conservée à la réouverture.
- [ ] Reset → **Valider** : la liste par défaut est bien persistée (recharger la page le confirme).

- [ ] **Step 3 : Si tout est bon, rien à committer.** Sinon, créer une tâche de correction.

---

## Notes

- DRY/YAGNI : un seul champ `actif` ; aucune nouvelle dépendance ; `wordList.js`
  inchangé (filtrage en amont dans `App`).
- Le projet n'a pas de tests UI automatisés ; les Tasks 2/3 sont validées
  manuellement (Task 5), conformément aux conventions du repo.
- L'utilisateur pousse directement sur `main` (cf. ses préférences).
