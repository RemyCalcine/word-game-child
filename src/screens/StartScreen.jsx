import React, { useState } from "react";
import { Screen } from "./Screen.jsx";
import { McLogo } from "../components/McLogo.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { WordEditor } from "./WordEditor.jsx";

export function StartScreen({ wordCount, prenom, entrees, onSaveConfig, onStart }) {
  const [editing, setEditing] = useState(false);

  return (
    <Screen>
      <button
        type="button"
        onClick={() => setEditing(true)}
        title="Réglages des mots"
        aria-label="Réglages des mots"
        style={{ position: "fixed", top: "var(--space-4)", right: "var(--space-4)", zIndex: 20, fontSize: 26, lineHeight: 1, padding: 8, cursor: "pointer", background: "rgba(15,11,8,0.55)", color: "var(--cream)", border: "2px solid rgba(244,234,208,0.3)", borderRadius: "var(--radius)" }}
      >
        ⚙️
      </button>

      <McLogo>Les Mots Blocs</McLogo>
      {prenom ? (
        <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
          Salut {prenom}&nbsp;! 👋
        </p>
      ) : null}
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
        Apprends tes mots de dictée bloc par bloc&nbsp;!
      </p>
      {wordCount > 0 ? (
        <p style={{ fontSize: "var(--text-lg)", color: "var(--cream)", margin: 0, opacity: 0.92 }}>
          {wordCount} mots à apprendre aujourd'hui.
        </p>
      ) : (
        <p style={{ fontSize: "var(--text-lg)", color: "var(--cream)", margin: 0 }}>
          ⚠️ La liste est vide — ouvre ⚙️ pour ajouter des mots.
        </p>
      )}
      <BlockButton variant="primary" size="lg" onClick={onStart} disabled={wordCount === 0}>
        ▶ Commencer
      </BlockButton>

      {editing ? (
        <WordEditor
          entrees={entrees}
          prenom={prenom}
          onValidate={onSaveConfig}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </Screen>
  );
}
