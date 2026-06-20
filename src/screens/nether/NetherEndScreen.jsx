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
