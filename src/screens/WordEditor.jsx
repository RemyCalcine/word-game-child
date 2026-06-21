import React, { useState } from "react";
import { BlockButton } from "../components/BlockButton.jsx";
import { normaliser } from "../wordList.js";
import { defaultMots } from "../config.js";

let _seq = 0;
const uid = () => `row-${++_seq}`;
const withIds = (mots) => mots.map((m) => ({ id: uid(), mot: m.mot, indice: m.indice, nether: m.nether }));

function apercuSyllabes(mot) {
  const syll = normaliser({ mot }).syllabes.filter(Boolean);
  return syll.length ? syll.join(" · ") : "";
}

const inputStyle = {
  fontFamily: "inherit", fontSize: "var(--text-md)", padding: "8px 10px",
  border: "2px solid var(--ink-soft)", borderRadius: "var(--radius)",
  background: "#fff", color: "var(--ink)", width: "100%", boxSizing: "border-box",
};

// Éditeur de la liste de mots, ouvert depuis l'accueil. Réordonnancement par
// glisser-déposer (poignée ☰), aperçu en direct du découpage syllabes, champ
// indice et case Nether par mot, plus le prénom de l'enfant. « Valider » applique.
export function WordEditor({ entrees, prenom, onValidate, onClose }) {
  const [rows, setRows] = useState(() => withIds(entrees));
  const [name, setName] = useState(prenom);
  const [dragId, setDragId] = useState(null);

  function maj(id, champ, valeur) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [champ]: valeur } : r)));
  }
  function supprimer(id) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }
  function ajouter() {
    setRows((rs) => [...rs, { id: uid(), mot: "", indice: "", nether: false }]);
  }
  function deplacer(id, delta) {
    setRows((rs) => {
      const i = rs.findIndex((r) => r.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const next = rs.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function reinitialiser() {
    setRows(withIds(defaultMots()));
  }

  function surGlisser(e, overId) {
    e.preventDefault();
    if (dragId == null || dragId === overId) return;
    setRows((rs) => {
      const from = rs.findIndex((r) => r.id === dragId);
      const to = rs.findIndex((r) => r.id === overId);
      if (from < 0 || to < 0) return rs;
      const next = rs.slice();
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  }

  function valider() {
    const propres = rows.filter((r) => r.mot.trim());
    onValidate(propres.map((r) => ({ mot: r.mot.trim(), indice: r.indice.trim(), nether: r.nether })), name.trim());
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "var(--space-4)", overflowY: "auto" }}
    >
      <div style={{ width: "100%", maxWidth: 560, margin: "var(--space-6) 0", background: "var(--cream)", color: "var(--ink)", border: "4px solid var(--ink)", borderRadius: "var(--radius)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", margin: 0, fontSize: "var(--display-md)", color: "var(--ink)" }}>⚙️ Réglages des mots</h2>

        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontWeight: 700 }}>
          Prénom de l'enfant
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="(facultatif)" />
        </label>

        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
          Glisse la poignée <strong>☰</strong> pour changer l'ordre. Ajoute un <strong>tiret</strong> dans le mot
          seulement si le découpage en syllabes affiché (→) est faux : ex. <em>mi-lieu</em>.
          Coche <strong>🔥</strong> pour qu'un mot rejoigne le <strong>bonus Nether</strong> (rappel de mémoire en fin de partie).
        </p>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {rows.map((r, i) => (
            <li
              key={r.id}
              onDragOver={(e) => surGlisser(e, r.id)}
              onDrop={(e) => e.preventDefault()}
              style={{ border: "2px solid var(--ink-soft)", borderRadius: "var(--radius)", padding: "var(--space-3)", background: dragId === r.id ? "#ffe9b0" : "#fff", display: "flex", flexDirection: "column", gap: 6 }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  draggable
                  onDragStart={() => setDragId(r.id)}
                  onDragEnd={() => setDragId(null)}
                  title="Glisser pour réordonner"
                  style={{ cursor: "grab", fontSize: 20, userSelect: "none", padding: "0 2px" }}
                >
                  ☰
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button type="button" onClick={() => deplacer(r.id, -1)} disabled={i === 0} title="Monter" style={{ cursor: i === 0 ? "default" : "pointer", lineHeight: 1, fontSize: 12, padding: "2px 5px", border: "2px solid var(--ink-soft)", borderRadius: "var(--radius)", background: "#fff", color: "var(--ink)", opacity: i === 0 ? 0.35 : 1 }}>▲</button>
                  <button type="button" onClick={() => deplacer(r.id, 1)} disabled={i === rows.length - 1} title="Descendre" style={{ cursor: i === rows.length - 1 ? "default" : "pointer", lineHeight: 1, fontSize: 12, padding: "2px 5px", border: "2px solid var(--ink-soft)", borderRadius: "var(--radius)", background: "#fff", color: "var(--ink)", opacity: i === rows.length - 1 ? 0.35 : 1 }}>▼</button>
                </div>
                <input style={{ ...inputStyle, flex: 1 }} value={r.mot} onChange={(e) => maj(r.id, "mot", e.target.value)} placeholder="mot (ex: mi-lieu)" />
                <label title="Mot du bonus Nether (rappel de mémoire en fin de partie)" style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={r.nether} onChange={(e) => maj(r.id, "nether", e.target.checked)} />
                  🔥
                </label>
                <button type="button" onClick={() => supprimer(r.id)} title="Supprimer" style={{ cursor: "pointer", background: "none", border: "none", fontSize: 20 }}>🗑️</button>
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", minHeight: "1.2em" }}>
                {r.mot.trim() ? `→ ${apercuSyllabes(r.mot)}` : ""}
              </div>
              <input style={inputStyle} value={r.indice} onChange={(e) => maj(r.id, "indice", e.target.value)} placeholder="indice (facultatif)" />
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <BlockButton variant="secondary" size="sm" onClick={ajouter}>➕ Ajouter un mot</BlockButton>
          <BlockButton variant="neutral" size="sm" onClick={reinitialiser}>↺ Réinitialiser</BlockButton>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "var(--space-2)" }}>
          <BlockButton variant="neutral" onClick={onClose}>Annuler</BlockButton>
          <BlockButton variant="primary" onClick={valider}>✅ Valider</BlockButton>
        </div>
      </div>
    </div>
  );
}
