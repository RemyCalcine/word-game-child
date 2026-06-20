// Porté depuis l'ancien game.js. Deux contournements connus du moteur Chrome :
// - le tout premier mot est souvent coupé (moteur "froid") -> amorcerVoix() ;
// - enchaîner cancel() puis speak() tronque le début du mot -> délai de 150ms.
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
let voixFr = null;

function chargerVoix() {
  if (!synth) return;
  const voix = synth.getVoices();
  voixFr =
    voix.find((v) => /^fr/i.test(v.lang) && /google/i.test(v.name)) ||
    voix.find((v) => /fr[-_]?fr/i.test(v.lang)) ||
    voix.find((v) => /^fr/i.test(v.lang)) ||
    null;
}
if (synth) {
  chargerVoix();
  synth.addEventListener("voiceschanged", chargerVoix);
}

export function amorcerVoix() {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  synth.speak(u);
}

function dire(texte, vitesse, surFin) {
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = "fr-FR";
  u.rate = vitesse;
  if (voixFr) u.voice = voixFr;
  if (surFin) u.addEventListener("end", surFin);
  synth.speak(u);
}

export function parler(texte, vitesse = 0.85, surFin) {
  if (!synth) {
    if (surFin) surFin();
    return;
  }
  if (synth.speaking || synth.pending) {
    synth.cancel();
    setTimeout(() => dire(texte, vitesse, surFin), 150);
  } else {
    dire(texte, vitesse, surFin);
  }
}

export function annulerVoix() {
  if (synth) synth.cancel();
}
