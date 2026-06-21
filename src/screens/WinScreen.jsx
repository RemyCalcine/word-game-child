import React, { useEffect, useState } from "react";
import { Screen } from "./Screen.jsx";
import { McLogo } from "../components/McLogo.jsx";
import { BlockButton } from "../components/BlockButton.jsx";
import { Diamond } from "../components/Diamond.jsx";
import { parler } from "../voice.js";
import { feliciter } from "../messages.js";

export function WinScreen({ word, prenom, onNext }) {
  const [message] = useState(() => feliciter(prenom)); // une félicitation au hasard, figée
  useEffect(() => {
    // Petit délai : laisse l'écran s'afficher (et la parole précédente se finir)
    // avant de parler, sinon le moteur coupe le début (« …nifique » pour « magnifique »).
    const t = setTimeout(() => parler(message), 300);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <Screen>
      <div style={{ fontSize: 72, animation: "bob 1s ease-in-out infinite" }}>🎉</div>
      <McLogo style={{ fontSize: "var(--display-xl)" }}>BRAVO !</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--cream)", margin: 0, textShadow: "var(--text-shadow-pixel-sm)" }}>
        Tu as écrit «&nbsp;{word.mot}&nbsp;» !
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--display-md)", color: "var(--diamond)", textShadow: "var(--text-shadow-pixel)", margin: 0, display: "inline-flex", gap: 8, alignItems: "center" }}>
        +10 <Diamond size={20} />
      </p>
      <BlockButton variant="reward" onClick={onNext}>Mot suivant ➡</BlockButton>
    </Screen>
  );
}
