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
import { EndScreen } from "./screens/EndScreen.jsx";
import { NetherIntroScreen } from "./screens/nether/NetherIntroScreen.jsx";
import { NetherFlashScreen } from "./screens/nether/NetherFlashScreen.jsx";
import { NetherEndScreen } from "./screens/nether/NetherEndScreen.jsx";

const MOTS_LISTE = prepareList(MOTS);
const MOTS_NETHER = MOTS_LISTE.filter((m) => m.nether);

export default function App() {
  const [mode, setMode] = useState("overworld"); // 'overworld' | 'nether'
  const [phase, setPhase] = useState("start");
  const [index, setIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [netherIndex, setNetherIndex] = useState(0);
  const [netherWordsOk, setNetherWordsOk] = useState(0);

  const isNether = mode === "nether";
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
    setNetherWordsOk(0);
    setMode("overworld");
    setPhase("learn");
  }

  function entrerNether() {
    setMode("nether");
    setNetherIndex(0);
    setNetherWordsOk(0);
    setPhase("n-intro");
  }

  function demarrerNether() {
    setPhase("n-write");
  }

  function gagnerMotNether() {
    setNetherWordsOk((n) => n + 1);
    setPhase("n-flash");
  }

  useEffect(() => {
    if (phase !== "n-flash") return;
    const t = setTimeout(() => {
      if (netherIndex + 1 >= MOTS_NETHER.length) setPhase("n-end");
      else {
        setNetherIndex(netherIndex + 1);
        setPhase("n-write");
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, netherIndex]);

  function sortirNether() {
    setMode("overworld");
    setPhase("start");
  }

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
          <EndScreen
            xp={xp}
            wordCount={MOTS_LISTE.length}
            hasNether={MOTS_NETHER.length > 0}
            onReplay={recommencer}
            onNether={entrerNether}
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
          />
        )}
        {phase === "n-flash" && <NetherFlashScreen word={word} />}
        {phase === "n-end" && <NetherEndScreen wordsOk={netherWordsOk} onExit={sortirNether} />}
      </main>
    </div>
  );
}
