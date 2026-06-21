import React, { useEffect, useRef, useState } from "react";
import { Screen } from "./Screen.jsx";
import { StepLabel } from "../components/StepLabel.jsx";
import { LetterTile } from "../components/LetterTile.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { parler } from "../voice.js";
import { encourager } from "../messages.js";

export function WriteScreen({ word, label, hint, nether = false, prenom, onWin, onSkip }) {
  const [saisie, setSaisie] = useState("");
  const [shake, setShake] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const gagne = useRef(false);

  useEffect(() => {
    gagne.current = false;
    setSaisie("");
    // On prononce le mot complet en arrivant à l'écriture (le petit délai laisse
    // finir la parole de l'écran précédent, sinon on n'entend que sa fin).
    const t = setTimeout(() => parler(word.mot), 300);
    return () => clearTimeout(t);
  }, [word.mot, nether]);

  useEffect(() => {
    function onKey(e) {
      if (gagne.current) return;
      if (e.key === "Backspace") {
        setSaisie((s) => s.slice(0, -1));
        e.preventDefault();
      } else if (e.key.length === 1 && e.key !== " ") {
        setSaisie((s) => (s.length >= word.mot.length ? s : s + e.key.toLowerCase()));
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [word.mot]);

  useEffect(() => {
    if (saisie.length !== word.mot.length) return;
    if (saisie === word.mot) {
      gagne.current = true;
      setTimeout(onWin, 350);
    } else {
      setShake(true);
      setEncouragement(encourager(prenom)); // encouragement varié, figé jusqu'à la prochaine tentative
      setTimeout(() => setShake(false), 350);
    }
  }, [saisie, word.mot, onWin, prenom]);

  const errare = saisie.length === word.mot.length && saisie !== word.mot;
  const feedback = errare ? `${encouragement} ${nether ? "Réessaie ou passe 🙂" : "Corrige les blocs rouges 🔴"}` : "";

  return (
    <Screen>
      <StepLabel>{label}</StepLabel>
      <BlockButton variant="secondary" size="sm" onClick={() => parler(word.mot)}>🔊 Réécouter</BlockButton>
      <div className={shake ? "shake" : ""} style={{ display: "flex", gap: "var(--gap-tiles)", flexWrap: "wrap", justifyContent: "center" }}>
        {[...word.mot].map((l, i) => {
          const tape = saisie[i];
          const state = tape === undefined ? "empty" : tape === l ? "good" : "bad";
          return <LetterTile key={i} letter={tape} state={state} />;
        })}
      </div>
      <p style={{ fontSize: "var(--text-md)", fontStyle: "italic", color: "var(--cream)", opacity: 0.9, margin: 0 }}>
        {feedback || hint}
      </p>
      {nether && errare ? (
        <div style={{ display: "flex", gap: "var(--gap-row)", flexWrap: "wrap", justifyContent: "center" }}>
          <BlockButton variant="secondary" onClick={() => setSaisie("")}>🔄 Nouvelle tentative</BlockButton>
          <BlockButton variant="neutral" onClick={onSkip}>⏭️ Passer</BlockButton>
        </div>
      ) : null}
    </Screen>
  );
}
