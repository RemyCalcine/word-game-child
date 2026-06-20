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
