import React, { useEffect, useMemo, useState } from "react";
import { prepareList } from "./wordList.js";
import { loadConfig, saveConfig } from "./config.js";
import { feliciter } from "./messages.js";
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

export default function App() {
  const [config] = useState(loadConfig); // lu une fois au démarrage
  const [entrees, setEntrees] = useState(config.mots); // [{ mot, indice, nether }]
  const [prenom, setPrenom] = useState(config.prenom);

  const [mode, setMode] = useState("overworld"); // 'overworld' | 'nether'
  const [phase, setPhase] = useState("start");
  const [index, setIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [netherIndex, setNetherIndex] = useState(0);
  const [netherResults, setNetherResults] = useState([]); // [{ mot, ok }]
  const [netherDone, setNetherDone] = useState(false);

  const motsListe = useMemo(
    () => prepareList(entrees.filter((e) => e.actif !== false)),
    [entrees]
  );
  const motsNether = useMemo(() => motsListe.filter((m) => m.nether), [motsListe]);

  const isNether = mode === "nether";
  const netherPoints = netherResults.filter((r) => r.ok).length * 15;
  const word = isNether ? motsNether[netherIndex] : motsListe[index];
  const nbEtapes = word && word.syllabes.length > 1 ? 3 : 2;
  const showHud = !["start", "end", "n-intro", "n-end"].includes(phase);
  const canGoBack = phase === "write" || phase === "syll" || (phase === "learn" && index > 0);

  function reset(versPhase) {
    setIndex(0);
    setXp(0);
    setNetherIndex(0);
    setNetherResults([]);
    setNetherDone(false);
    setMode("overworld");
    setPhase(versPhase);
  }

  function enregistrerConfig(nextEntrees, nextPrenom) {
    setEntrees(nextEntrees);
    setPrenom(nextPrenom);
    saveConfig({ prenom: nextPrenom, mots: nextEntrees });
  }

  function commencer() {
    amorcerVoix();
    reset("learn");
  }

  function recommencer() {
    reset("learn");
  }

  function quitterPartie() {
    reset("start"); // retour à l'accueil pour reconfigurer les mots si besoin
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
    if (index + 1 >= motsListe.length) setPhase("end");
    else {
      setIndex(index + 1);
      setPhase("learn");
    }
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
    if (netherIndex + 1 >= motsNether.length) setPhase("n-end");
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
  const hudTotal = isNether ? motsNether.length : motsListe.length;

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
        {phase === "start" && (
          <StartScreen
            wordCount={motsListe.length}
            prenom={prenom}
            entrees={entrees}
            onSaveConfig={enregistrerConfig}
            onStart={commencer}
          />
        )}
        {phase === "learn" && <LearnScreen key={index} word={word} nbSteps={nbEtapes} onNext={versEtapeSuivante} />}
        {phase === "syll" && (
          <SyllablesScreen key={index} word={word} prenom={prenom} onDone={() => setPhase("write")} onScore={(n) => setXp((x) => x + n)} />
        )}
        {phase === "write" && (
          <WriteScreen
            key={index}
            word={word}
            prenom={prenom}
            label={`⛏️ Étape ${nbEtapes}/${nbEtapes} — Écris le mot`}
            hint="⌨️ Tape le mot au clavier (Retour arrière pour corriger)"
            onWin={gagnerMot}
          />
        )}
        {phase === "win" && <WinScreen word={word} prenom={prenom} onNext={motSuivant} />}
        {phase === "end" && (
          <RecapScreen
            title="Mots réussis !"
            prenom={prenom}
            voice={netherDone ? `${feliciter(prenom)} Voici ton total.` : `${feliciter(prenom)} Tu as réussi tous les mots !`}
            words={motsListe.map((m) => ({ mot: m.mot, ok: true }))}
            netherWords={netherDone ? netherResults : undefined}
            total={netherDone ? xp + netherPoints : xp}
            primaryLabel="🔁 Rejouer"
            onPrimary={recommencer}
            secondaryLabel="🚪 Quitter la partie"
            onSecondary={quitterPartie}
            onNether={!netherDone && motsNether.length > 0 ? entrerNether : undefined}
          />
        )}

        {phase === "n-intro" && <NetherIntroScreen onStart={demarrerNether} />}
        {phase === "n-write" && (
          <WriteScreen
            key={"n" + netherIndex}
            word={word}
            nether
            prenom={prenom}
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
            voice={`${feliciter(prenom)} Tu as fini l'épreuve du Nether !`}
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
