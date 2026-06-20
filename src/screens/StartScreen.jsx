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
