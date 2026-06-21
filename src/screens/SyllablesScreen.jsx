import React, { useRef, useState } from "react";
import { Screen } from "./Screen.jsx";
import { StepLabel } from "../components/StepLabel.jsx";
import { SyllableTile } from "../components/SyllableTile.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { parler } from "../voice.js";
import { feliciter } from "../messages.js";

function melanger(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.every((x, k) => x.idx === k)) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

export function SyllablesScreen({ word, prenom, onDone, onScore }) {
  const target = word.syllabes;
  const [placees, setPlacees] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const [bank] = useState(() => melanger(target.map((s, idx) => ({ s, idx }))));
  const [posees, setPosees] = useState({}); // { idx: true }
  const [feedback, setFeedback] = useState("");
  const [shakeIdx, setShakeIdx] = useState(-1);
  const termine = useRef(false);

  function cliquer(item) {
    if (termine.current || posees[item.idx]) return;
    if (item.idx === placees) {
      setPosees((p) => ({ ...p, [item.idx]: true }));
      const np = placees + 1;
      setPlacees(np);
      if (np === target.length) {
        termine.current = true;
        const sansFaute = erreurs === 0;
        onScore(5 + (sansFaute ? 5 : 0));
        setFeedback(sansFaute ? "Parfait, sans erreur ! 🌟 +10 💎" : "Bien joué ! 🧩 +5 💎");
        // On laisse la dernière syllabe finir avant de féliciter (sinon elle est
        // coupée et l'enfant entend « Bravo » tout de suite).
        parler(target[item.idx], 0.8, () => {
          parler(`${feliciter(prenom)} Tu as trouvé : ${word.mot}`, 0.85, onDone);
        });
      } else {
        parler(target[item.idx], 0.8);
      }
    } else {
      setErreurs((e) => e + 1);
      setShakeIdx(item.idx);
      setTimeout(() => setShakeIdx(-1), 350);
      setFeedback("Écoute encore ! 👂");
      parler(word.mot);
    }
  }

  const indiceActif = erreurs >= 3;

  return (
    <Screen>
      <StepLabel>🧩 Étape 2/3 — Reconstruis le mot</StepLabel>
      <BlockButton variant="secondary" size="sm" onClick={() => parler(word.mot)}>🔊 Réécouter</BlockButton>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center", minHeight: 60 }}>
        {target.map((_, i) => (
          <SyllableTile key={i} slot state={i < placees ? "filled" : "default"}>
            {i < placees ? target[i] : ""}
          </SyllableTile>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center", minHeight: 60 }}>
        {bank.map((item) => {
          const isPosee = !!posees[item.idx];
          const isHint = indiceActif && item.idx === placees && !isPosee;
          return (
            <SyllableTile
              key={item.idx}
              state={isPosee ? "disabled" : isHint ? "hint" : "default"}
              onClick={() => cliquer(item)}
              style={shakeIdx === item.idx ? { animation: "shake 0.35s" } : undefined}
            >
              {item.s}
            </SyllableTile>
          );
        })}
      </div>
      <p style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--cream)", minHeight: "1.4em", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
        {feedback}
      </p>
    </Screen>
  );
}
