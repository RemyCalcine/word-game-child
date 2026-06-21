// Configuration éditable par le parent (liste de mots + prénom de l'enfant),
// sauvegardée dans le navigateur (localStorage). words.js sert de liste par
// défaut au tout premier lancement (ou après « Réinitialiser »).
import { MOTS } from "./words.js";

const KEY = "motsblocs-config-v1";

function toEntry(m) {
  return typeof m === "string"
    ? { mot: m, indice: "", nether: false }
    : { mot: m.mot || "", indice: m.indice || "", nether: !!m.nether };
}

export function defaultMots() {
  return MOTS.map(toEntry);
}

export function loadConfig() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!data) return { prenom: "", mots: defaultMots() };
    return {
      prenom: typeof data.prenom === "string" ? data.prenom : "",
      mots: Array.isArray(data.mots) && data.mots.length ? data.mots.map(toEntry) : defaultMots(),
    };
  } catch {
    return { prenom: "", mots: defaultMots() };
  }
}

export function saveConfig({ prenom, mots }) {
  try {
    const clean = mots.map(({ mot, indice, nether }) => ({ mot, indice, nether }));
    localStorage.setItem(KEY, JSON.stringify({ prenom, mots: clean }));
  } catch {
    // localStorage indisponible (navigation privée, quota plein) : on reste en mémoire.
  }
}
