// Messages aléatoires (félicitation / encouragement) pour varier les retours et
// éviter l'effet répétitif. {prenom} est remplacé par le prénom de l'enfant, ou
// retiré proprement s'il est vide — chaque modèle reste correct sans le prénom.

const FELICITATIONS = [
  "Bravo {prenom} !",
  "Super {prenom} !",
  "Génial !",
  "Bien joué {prenom} !",
  "Trop fort !",
  "Excellent {prenom} !",
  "Tu assures {prenom} !",
  "Parfait !",
  "Magnifique !",
  "Champion {prenom} !",
  "Quel talent {prenom} !",
  "Waouh, bravo !",
];

const ENCOURAGEMENTS = [
  "Presque {prenom} !",
  "Tout près !",
  "Encore un effort {prenom} !",
  "Tu y es presque !",
  "Continue {prenom} !",
  "Ça vient {prenom} !",
];

function rendre(modele, prenom) {
  return modele.replaceAll("{prenom}", prenom || "").replace(/\s{2,}/g, " ").trim();
}

function piocher(liste, prenom) {
  return rendre(liste[Math.floor(Math.random() * liste.length)], prenom);
}

export function feliciter(prenom) {
  return piocher(FELICITATIONS, prenom);
}

export function encourager(prenom) {
  return piocher(ENCOURAGEMENTS, prenom);
}
