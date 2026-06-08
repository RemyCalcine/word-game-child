// ===========================================================================
//  LES MOTS BLOCS — logique du jeu
//  Génère les niveaux automatiquement à partir de la liste MOTS (words.js).
// ===========================================================================

// --- 1. Préparer la liste -------------------------------------------------
// Accepte "mot", "mo-t" (tirets = découpage choisi), ou { mot, indice }.
function normaliser(entree) {
  const brut = (typeof entree === "string" ? entree : entree.mot || "").trim().toLowerCase();
  const indice = typeof entree === "string" ? "" : entree.indice || "";
  const mot = brut.replace(/-/g, "");
  const syllabes = brut.includes("-")
    ? brut.split("-").filter(Boolean)   // découpage donné par le parent
    : decouperAuto(mot);                // découpage automatique
  return { mot, indice, syllabes };
}

// Découpage automatique en syllabes (heuristique français, imparfait : pour les
// sons piège, mettre un tiret dans words.js). Règles : un noyau = un groupe de
// voyelles ; 1 consonne -> syllabe suivante (V-CV) ; 2 consonnes -> coupe au
// milieu (VC-CV) sauf groupe inséparable (bl, tr, ch, gn...) ; un "e" muet final
// est rattaché à la syllabe précédente (fille -> "fille", famille -> "fa-mille").
const VOYELLES = "aeiouyàâäéèêëïîôöùûüœæ";
function decouperAuto(mot) {
  const estV = c => VOYELLES.includes(c);
  if (mot.length < 2) return [mot];

  const noyaux = [];
  for (let i = 0; i < mot.length; ) {
    if (estV(mot[i])) {
      const d = i;
      while (i < mot.length && estV(mot[i])) i++;
      noyaux.push([d, i - 1]);
    } else i++;
  }
  if (noyaux.length <= 1) return [mot];

  const coupes = [];
  for (let k = 0; k < noyaux.length - 1; k++) {
    const finVoy = noyaux[k][1];
    const cons = mot.slice(finVoy + 1, noyaux[k + 1][0]);
    if (cons.length <= 1) {
      coupes.push(finVoy + cons.length);                 // V-CV (ou voyelles jointes)
    } else {
      const insep = (/[bcdfgpqtv]/.test(cons[0]) && /[lr]/.test(cons[1]))
        || ["ch", "ph", "th", "gn"].includes(cons.slice(0, 2));
      coupes.push(finVoy + (insep ? 1 : 2));             // V-CCV ou VC-CV
    }
  }

  const syll = [];
  let prev = 0;
  for (const c of coupes) { syll.push(mot.slice(prev, c)); prev = c; }
  syll.push(mot.slice(prev));

  // "e" muet final : rattacher la dernière syllabe à la précédente.
  if (syll.length > 1) {
    const last = syll[syll.length - 1];
    if (last.endsWith("e") && [...last].filter(estV).length === 1) {
      syll[syll.length - 2] += last;
      syll.pop();
    }
  }
  // Sécurité : une syllabe sans voyelle est rattachée à la précédente.
  for (let k = syll.length - 1; k > 0; k--) {
    if (![...syll[k]].some(estV)) { syll[k - 1] += syll[k]; syll.splice(k, 1); }
  }
  return syll;
}

const MOTS_LISTE = MOTS.map(normaliser).filter(m => m.mot.length > 0);
const XP_PAR_MOT = 10;
const XP_SYLLABE = 5;   // puzzle réussi
const XP_BONUS   = 5;   // bonus si reconstruit sans erreur

// --- 2. État du jeu -------------------------------------------------------
const etat = { index: 0, xp: 0 };

// --- 3. Raccourcis DOM ----------------------------------------------------
const $ = sel => document.querySelector(sel);
const screens = {
  start: $("#screen-start"),
  learn: $("#screen-learn"),
  syll:  $("#screen-syll"),
  write: $("#screen-write"),
  win:   $("#screen-win"),
  end:   $("#screen-end"),
};

function montrer(nom) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[nom].classList.add("active");
}

// --- 4. Voix (sons) -------------------------------------------------------
// L'API Web Speech de Chrome a deux défauts connus :
//   - le tout premier mot est souvent coupé (moteur « froid ») ;
//   - enchaîner cancel() puis speak() tronque le début du mot.
// On choisit une vraie voix française et on contourne ces deux pièges.

const synth = window.speechSynthesis;
let voixFr = null;

function chargerVoix() {
  if (!synth) return;
  const voix = synth.getVoices();
  voixFr =
    voix.find(v => /^fr/i.test(v.lang) && /google/i.test(v.name)) || // la plus fluide
    voix.find(v => /fr[-_]?fr/i.test(v.lang)) ||
    voix.find(v => /^fr/i.test(v.lang)) ||
    null;
}
if (synth) {
  chargerVoix();
  synth.addEventListener("voiceschanged", chargerVoix);
}

// À appeler sur un geste utilisateur (clic) pour « réveiller » le moteur.
function amorcerVoix() {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0; // inaudible
  synth.speak(u);
}

function dire(texte, vitesse) {
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = "fr-FR";
  u.rate = vitesse;
  if (voixFr) u.voice = voixFr;
  synth.speak(u);
}

function parler(texte, vitesse = 0.85) {
  if (!synth) return;
  if (synth.speaking || synth.pending) {
    // une voix parle déjà : on l'arrête puis on laisse le moteur respirer
    // (sinon le début du nouveau mot est coupé).
    synth.cancel();
    setTimeout(() => dire(texte, vitesse), 150);
  } else {
    dire(texte, vitesse);
  }
}

// --- 5. HUD ---------------------------------------------------------------
function majHud() {
  $("#hud").classList.remove("hidden");
  $("#hud-level").textContent = `Mot ${etat.index + 1} / ${MOTS_LISTE.length}`;
  $("#hud-xp").textContent = etat.xp;
  $("#progress-bar").style.width = (etat.index / MOTS_LISTE.length) * 100 + "%";
}

function motCourant() { return MOTS_LISTE[etat.index]; }

// --- 6. Construire les blocs-lettres -------------------------------------
function construireBlocs(conteneur, mot, { caches = false } = {}) {
  conteneur.innerHTML = "";
  [...mot].forEach(lettre => {
    const bloc = document.createElement("div");
    bloc.className = "letter" + (caches ? " empty" : "");
    bloc.textContent = caches ? "" : lettre;
    conteneur.appendChild(bloc);
  });
  return [...conteneur.children];
}

// ===========================================================================
//  ÉTAPE 1 — DÉCOUVERTE
// ===========================================================================
function lancerDecouverte() {
  majHud();
  const { mot, indice } = motCourant();
  $("#learn-hint").textContent = indice;
  construireBlocs($("#learn-blocks"), mot);
  montrer("learn");
  parler(mot);
}

function epeler() {
  const { mot } = motCourant();
  const blocs = [...$("#learn-blocks").children];
  let i = 0;
  window.speechSynthesis.cancel();
  const pas = () => {
    blocs.forEach(b => b.classList.remove("spelling"));
    if (i >= mot.length) { parler(mot); return; }
    blocs[i].classList.add("spelling");
    parler(mot[i], 0.7);
    i++;
    setTimeout(pas, 750);
  };
  pas();
}

// ===========================================================================
//  ÉTAPE 2 — SYLLABES (reconstituer le mot)
// ===========================================================================
let syllCible = [];   // syllabes dans l'ordre correct
let syllPlacees = 0;  // combien sont déjà posées
let syllErreurs = 0;  // erreurs sur ce mot (bonus + indice)

function melanger(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // éviter de retomber sur l'ordre déjà correct
  if (a.length > 1 && a.every((x, k) => x.idx === k)) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

function lancerSyllabes() {
  const m = motCourant();
  if (m.syllabes.length <= 1) { lancerEcriture(); return; } // rien à reconstruire

  syllCible = m.syllabes;
  syllPlacees = 0;
  syllErreurs = 0;
  $("#syll-feedback").textContent = "";
  $("#btn-syll-next").classList.add("hidden");

  const slots = $("#syll-slots");
  slots.innerHTML = "";
  syllCible.forEach(() => {
    const s = document.createElement("div");
    s.className = "syll-slot";
    slots.appendChild(s);
  });

  const bank = $("#syll-bank");
  bank.innerHTML = "";
  melanger(syllCible.map((s, idx) => ({ s, idx }))).forEach(({ s, idx }) => {
    const t = document.createElement("button");
    t.className = "syll-tile";
    t.textContent = s;
    t.dataset.idx = idx;
    t.addEventListener("click", () => cliquerTuile(t));
    bank.appendChild(t);
  });

  montrer("syll");
  parler(m.mot);
}

function montrerIndice() {
  [...$("#syll-bank").children].forEach(x => x.classList.remove("indice"));
  const bonne = [...$("#syll-bank").children]
    .find(x => +x.dataset.idx === syllPlacees && !x.disabled);
  if (bonne) bonne.classList.add("indice");
}

function cliquerTuile(t) {
  const idx = +t.dataset.idx;

  if (idx === syllPlacees) {
    // bonne syllabe : on la pose dans la case
    const slot = $("#syll-slots").children[syllPlacees];
    slot.textContent = syllCible[idx];
    slot.classList.add("filled");
    t.disabled = true;
    t.classList.remove("indice");
    parler(syllCible[idx], 0.8);
    syllPlacees++;
    if (syllPlacees === syllCible.length) reussirSyll();
    else if (syllErreurs >= 3) montrerIndice();
  } else {
    // mauvaise syllabe : aucun blâme, on encourage à réessayer
    syllErreurs++;
    t.classList.add("shake");
    setTimeout(() => t.classList.remove("shake"), 350);
    $("#syll-feedback").textContent = "Écoute encore ! 👂";
    parler(motCourant().mot);
    if (syllErreurs >= 3) montrerIndice(); // on ne reste jamais bloqué
  }
}

function reussirSyll() {
  const sansFaute = syllErreurs === 0;
  etat.xp += XP_SYLLABE + (sansFaute ? XP_BONUS : 0);
  $("#hud-xp").textContent = etat.xp;
  $("#syll-feedback").textContent = sansFaute
    ? `Parfait, sans erreur ! 🌟 +${XP_SYLLABE + XP_BONUS} 💎`
    : `Bien joué ! 🧩 +${XP_SYLLABE} 💎`;
  $("#btn-syll-next").classList.remove("hidden");
  parler(sansFaute ? "Parfait !" : "Bravo !");
}

// ===========================================================================
//  ÉTAPE 3 — ÉCRITURE
// ===========================================================================
let blocsEcriture = [];
let saisie = ""; // ce que l'enfant a tapé jusqu'ici

function lancerEcriture() {
  const { mot } = motCourant();
  blocsEcriture = construireBlocs($("#write-blocks"), mot, { caches: true });
  saisie = "";
  $("#write-feedback").textContent = "";
  montrer("write");
}

// On capte le clavier au niveau du document : pas de champ à « cliquer » d'abord,
// l'enfant peut taper tout de suite.
function gererTouche(e) {
  if (!screens.write.classList.contains("active")) return;
  const { mot } = motCourant();

  if (e.key === "Backspace") {
    saisie = saisie.slice(0, -1);
  } else if (e.key.length === 1 && e.key !== " ") {
    if (saisie.length >= mot.length) return;
    saisie += e.key.toLowerCase();
  } else {
    return; // touches ignorées (flèches, Maj, etc.)
  }
  e.preventDefault();
  rafraichirEcriture();
}

function rafraichirEcriture() {
  const { mot } = motCourant();

  blocsEcriture.forEach((bloc, i) => {
    const tape = saisie[i];
    bloc.className = "letter";
    if (tape === undefined) {
      bloc.classList.add("empty");
      bloc.textContent = "";
    } else {
      bloc.textContent = tape;
      bloc.classList.add(tape === mot[i] ? "good" : "bad");
    }
  });

  // Mot complet ?
  if (saisie.length === mot.length) {
    if (saisie === mot) {
      reussir();
    } else {
      $("#write-feedback").textContent = "Presque ! Corrige les blocs rouges 🔴";
      $("#write-blocks").classList.add("shake");
      setTimeout(() => $("#write-blocks").classList.remove("shake"), 350);
    }
  } else {
    $("#write-feedback").textContent = "";
  }
}

// ===========================================================================
//  RÉUSSITE
// ===========================================================================
function reussir() {
  etat.xp += XP_PAR_MOT;
  const { mot } = motCourant();
  $("#win-word").textContent = `Tu as écrit « ${mot} » !`;
  majHud();
  $("#progress-bar").style.width = ((etat.index + 1) / MOTS_LISTE.length) * 100 + "%";
  montrer("win");
  parler("Bravo !");
}

function motSuivant() {
  etat.index++;
  if (etat.index >= MOTS_LISTE.length) {
    finir();
  } else {
    lancerDecouverte();
  }
}

function finir() {
  $("#hud").classList.add("hidden");
  $("#end-score").textContent =
    `Tu as gagné ${etat.xp} 💎 sur ${MOTS_LISTE.length} mots !`;
  montrer("end");
  parler("Félicitations ! Tu as réussi tous les mots !");
}

function recommencer() {
  etat.index = 0;
  etat.xp = 0;
  lancerDecouverte();
}

// ===========================================================================
//  Branchements
// ===========================================================================
$("#start-count").textContent = `${MOTS_LISTE.length} mots à apprendre aujourd'hui.`;

$("#btn-start").addEventListener("click", () => {
  amorcerVoix();            // réveille le moteur de voix dès le premier clic
  etat.index = 0;
  etat.xp = 0;
  lancerDecouverte();
});
$("#btn-listen").addEventListener("click", () => parler(motCourant().mot));
$("#btn-listen-2").addEventListener("click", () => parler(motCourant().mot));
$("#btn-listen-syll").addEventListener("click", () => parler(motCourant().mot));
$("#btn-spell").addEventListener("click", epeler);
$("#btn-to-syll").addEventListener("click", lancerSyllabes);
$("#btn-syll-next").addEventListener("click", lancerEcriture);
$("#btn-next").addEventListener("click", motSuivant);
$("#btn-replay").addEventListener("click", recommencer);

document.addEventListener("keydown", gererTouche);

// Sécurité : liste vide
if (MOTS_LISTE.length === 0) {
  $("#start-count").textContent = "⚠️ La liste de mots est vide (voir words.js).";
  $("#btn-start").disabled = true;
}
