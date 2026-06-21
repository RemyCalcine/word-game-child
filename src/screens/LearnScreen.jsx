import React, { useEffect, useState } from "react";
import { Screen } from "./Screen.jsx";
import { StepLabel } from "../components/StepLabel.jsx";
import { LetterTile } from "../components/LetterTile.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { parler, annulerVoix } from "../voice.js";

export function LearnScreen({ word, nbSteps, onNext }) {
  const [spelling, setSpelling] = useState(-1);

  useEffect(() => {
    // Petit délai : laisse l'écran s'afficher avant de parler, sinon le moteur
    // coupe le début du mot (« …lieu » pour « milieu »), surtout sur le 1er mot.
    const t = setTimeout(() => parler(word.mot), 300);
    return () => clearTimeout(t);
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
