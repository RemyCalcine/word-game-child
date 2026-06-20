// Porté depuis l'ancien game.js — même heuristique de découpage syllabes.
// Accepte "mot", "mo-t" (tirets = découpage choisi), ou { mot, indice, nether }.
export function normaliser(entree) {
  const brut = (typeof entree === "string" ? entree : entree.mot || "").trim().toLowerCase();
  const indice = typeof entree === "string" ? "" : entree.indice || "";
  const nether = typeof entree === "string" ? false : !!entree.nether;
  const mot = brut.replace(/-/g, "");
  const syllabes = brut.includes("-")
    ? brut.split("-").filter(Boolean)
    : decouperAuto(mot);
  return { mot, indice, syllabes, nether };
}

const VOYELLES = "aeiouyàâäéèêëïîôöùûüœæ";

export function decouperAuto(mot) {
  const estV = (c) => VOYELLES.includes(c);
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
      coupes.push(finVoy + cons.length);
    } else {
      const insep =
        (/[bcdfgpqtv]/.test(cons[0]) && /[lr]/.test(cons[1])) ||
        ["ch", "ph", "th", "gn"].includes(cons.slice(0, 2));
      coupes.push(finVoy + (insep ? 1 : 2));
    }
  }

  const syll = [];
  let prev = 0;
  for (const c of coupes) {
    syll.push(mot.slice(prev, c));
    prev = c;
  }
  syll.push(mot.slice(prev));

  if (syll.length > 1) {
    const last = syll[syll.length - 1];
    if (last.endsWith("e") && [...last].filter(estV).length === 1) {
      syll[syll.length - 2] += last;
      syll.pop();
    }
  }
  for (let k = syll.length - 1; k > 0; k--) {
    if (![...syll[k]].some(estV)) {
      syll[k - 1] += syll[k];
      syll.splice(k, 1);
    }
  }
  return syll;
}

export function prepareList(mots) {
  return mots.map(normaliser).filter((m) => m.mot.length > 0);
}
