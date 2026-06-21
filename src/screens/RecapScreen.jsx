import React, { useEffect, useState } from "react";
import { Screen } from "./Screen.jsx";
import { McLogo } from "../components/McLogo.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { PortalButton } from "../components/PortalButton.jsx";
import { Diamond } from "../components/Diamond.jsx";
import { parler } from "../voice.js";

function ListeMots({ mots }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 6 }}>
      {mots.map(({ mot, ok }, i) => (
        <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--cream)", textShadow: "var(--text-shadow-pixel-sm)" }}>
          <span>{mot}</span>
          <span style={{ color: ok ? "var(--good)" : "var(--cream-dim)" }}>{ok ? "✓" : "passé"}</span>
        </li>
      ))}
    </ul>
  );
}

// Page de récap commune. Affichée comme récap principal (fin d'overworld, puis à
// nouveau après le Nether avec la section Nether en plus) et comme écran de fin
// du Nether. Ton toujours positif : un mot non réussi est « passé », jamais perdu.
export function RecapScreen({ title, voice, prenom, nether = false, words, netherWords, total, primaryLabel, onPrimary, secondaryLabel, onSecondary, onNether }) {
  const [spokenLine] = useState(voice); // figé au montage : pas de re-speak si le parent re-render
  useEffect(() => {
    parler(spokenLine);
  }, [spokenLine]);

  return (
    <Screen>
      <div style={{ fontSize: 80, animation: "bob 1s ease-in-out infinite" }}>🏆</div>
      <McLogo nether={nether} style={{ fontSize: "var(--display-xl)" }}>{title}</McLogo>
      {prenom ? (
        <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
          Bravo {prenom}&nbsp;! 🎉
        </p>
      ) : null}

      {/* Panneau sombre translucide : détache les résultats du fond pour la lisibilité. */}
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", background: "rgba(15, 11, 8, 0.62)", border: "2px solid rgba(244, 234, 208, 0.18)", borderRadius: "var(--radius)" }}>
        <ListeMots mots={words} />

        {netherWords ? (
          <>
            <p style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "#ffd07a", margin: "var(--space-2) 0 0", textShadow: "0 0 10px #ff6a1f66" }}>
              🔥 Nether — de mémoire
            </p>
            <ListeMots mots={netherWords} />
          </>
        ) : null}

        <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, display: "inline-flex", gap: 8, alignItems: "center", textShadow: "var(--text-shadow-pixel-sm)" }}>
          Total : {total} <Diamond size={22} />
        </p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
        <BlockButton variant="primary" onClick={onPrimary}>{primaryLabel}</BlockButton>
        {onSecondary ? (
          <BlockButton variant="neutral" onClick={onSecondary}>{secondaryLabel}</BlockButton>
        ) : null}
      </div>

      {onNether ? (
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
