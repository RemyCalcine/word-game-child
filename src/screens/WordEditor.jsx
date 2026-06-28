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
