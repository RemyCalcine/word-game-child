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
