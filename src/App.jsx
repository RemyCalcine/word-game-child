import React, { useEffect, useState } from "react";
import { MOTS } from "./words.js";
import { prepareList } from "./wordList.js";
import { amorcerVoix } from "./voice.js";
import { GroundBackground } from "./components/GroundBackground.jsx";
import { HudBar } from "./components/HudBar.jsx";
import { StartScreen } from "./screens/StartScreen.jsx";
import { LearnScreen } from "./screens/LearnScreen.jsx";
import { SyllablesScreen } from "./screens/SyllablesScreen.jsx";
import { WriteScreen } from "./screens/WriteScreen.jsx";
import { WinScreen } from "./screens/WinScreen.jsx";
import { RecapScreen } from "./screens/RecapScreen.jsx";
import { NetherIntroScreen } from "./screens/nether/NetherIntroScreen.jsx";
import { NetherFlashScreen } from "./screens/nether/NetherFlashScreen.jsx";

const MOTS_LISTE = prepareList(MOTS);
const MOTS_NETHER = MOTS_LISTE.filter((m) => m.nether);

export default function App() {
  const [mode, setMode] = useState("overworld"); // 'overworld' | 'nether'
  const [phase, setPhase] = useState("start");
  const [index, setIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [netherIndex, setNetherIndex] = useState(0);
  const [netherResults, setNetherResults] = useState([]); // [{ mot, ok }]
  const [netherDone, setNetherDone] = useState(false);

  const isNether = mode === "nether";
  const netherPoints = netherResults.filter((r) => r.ok).length * 15;
  const word = isNether ? MOTS_NETHER[netherIndex] : MOTS_LISTE[index];
  const nbEtapes = word && word.syllabes.length > 1 ? 3 : 2;
  const showHud = !["start", "end", "n-intro", "n-end"].includes(phase);
  const canGoBack = phase === "write" || phase === "syll" || (phase === "learn" && index > 0);

  function commencer() {
    amorcerVoix();
    setIndex(0);
    setXp(0);
    setPhase("learn");
  }

  function retour() {
    if (phase === "write") setPhase(word.syllabes.length > 1 ? "syll" : "learn");
    else if (phase === "syll") setPhase("learn");
    else if (phase === "learn" && index > 0) {
      setIndex(index - 1);
      setPhase("learn");
    }
  }

  function versEtapeSuivante() {
    setPhase(word.syllabes.length > 1 ? "syll" : "write");
  }

  function gagnerMot() {
    setXp((x) => x + 10);
    setPhase("win");
  }

  function motSuivant() {
    if (index + 1 >= MOTS_LISTE.length) setPhase("end");
    else {
      setIndex(index + 1);
      setPhase("learn");
    }
  }

  function recommencer() {
    setIndex(0);
    setXp(0);
    setNetherIndex(0);
    setNetherResults([]);
    setNetherDone(false);
    setMode("overworld");
    setPhase("learn");
  }

  function entrerNether() {
    setMode("nether");
    setNetherIndex(0);
    setNetherResults([]);
    setPhase("n-intro");
  }

  function quitterNether() {
    setMode("overworld");
    setNetherDone(true);
    setPhase("end"); // retour au récap principal, enrichi du résultat Nether
  }

  function demarrerNether() {
    setPhase("n-write");
  }

  function prochainMotNether() {
    if (netherIndex + 1 >= MOTS_NETHER.length) setPhase("n-end");
    else {
      setNetherIndex(netherIndex + 1);
      setPhase("n-write");
    }
  }

  function gagnerMotNether() {
    setNetherResults((r) => [...r, { mot: word.mot, ok: true }]);
    setPhase("n-flash"); // petite récompense, puis l'effet ci-dessous enchaîne
  }

  function passerMotNether() {
    setNetherResults((r) => [...r, { mot: word.mot, ok: false }]);
    prochainMotNether(); // pas de récompense : on passe directement au mot suivant
  }

  useEffect(() => {
    if (phase !== "n-flash") return;
    const t = setTimeout(prochainMotNether, 1000);
    return () => clearTimeout(t);
  }, [phase, netherIndex]);

  const hudIndex = isNether ? netherIndex : index;
  const hudTotal = isNether ? MOTS_NETHER.length : MOTS_LISTE.length;

  return (
    <div
      className={isNether ? "theme-nether" : undefined}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <GroundBackground nether={isNether} />
      {showHud && (
        <HudBar index={hudIndex} total={hudTotal} xp={xp} canGoBack={canGoBack} onBack={retour} />
      )}
      <main
        style={{
          width: "100%", maxWidth: "var(--content-max)", flex: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "var(--pad-screen)",
        }}
      >
        {phase === "start" && <StartScreen wordCount={MOTS_LISTE.length} onStart={commencer} />}
        {phase === "learn" && <LearnScreen key={index} word={word} nbSteps={nbEtapes} onNext={versEtapeSuivante} />}
        {phase === "syll" && (
          <SyllablesScreen key={index} word={word} onDone={() => setPhase("write")} onScore={(n) => setXp((x) => x + n)} />
        )}
        {phase === "write" && (
          <WriteScreen
            key={index}
            word={word}
            label={`⛏️ Étape ${nbEtapes}/${nbEtapes} — Écris le mot`}
            hint="⌨️ Tape le mot au clavier (Retour arrière pour corriger)"
            onWin={gagnerMot}
          />
        )}
        {phase === "win" && <WinScreen word={word} onNext={motSuivant} />}
        {phase === "end" && (
          <RecapScreen
            title="Mots réussis !"
            voice={netherDone ? "Bravo ! Voici ton total." : "Félicitations ! Tu as réussi tous les mots !"}
            words={MOTS_LISTE.map((m) => ({ mot: m.mot, ok: true }))}
            netherWords={netherDone ? netherResults : undefined}
            total={netherDone ? xp + netherPoints : xp}
            primaryLabel="🔁 Rejouer"
            onPrimary={recommencer}
            onNether={!netherDone && MOTS_NETHER.length > 0 ? entrerNether : undefined}
          />
        )}

        {phase === "n-intro" && <NetherIntroScreen onStart={demarrerNether} />}
        {phase === "n-write" && (
          <WriteScreen
            key={"n" + netherIndex}
            word={word}
            nether
            label="🔊 Écoute et écris de mémoire"
            hint="Aucun bloc ne t'aide ici. Tape ce que tu entends."
            onWin={gagnerMotNether}
            onSkip={passerMotNether}
          />
        )}
        {phase === "n-flash" && <NetherFlashScreen word={word} />}
        {phase === "n-end" && (
          <RecapScreen
            title="Nether terminé !"
            voice="Bravo ! Tu as fini l'épreuve du Nether !"
            nether
            words={netherResults}
            total={netherPoints}
            primaryLabel="↩ Quitter le Nether"
            onPrimary={quitterNether}
          />
        )}
      </main>
    </div>
  );
}
