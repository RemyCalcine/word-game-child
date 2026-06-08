// ===========================================================================
//  LISTE DES MOTS DE DICTÉE
// ===========================================================================
//
//  👉 POUR METTRE À JOUR LA LISTE : modifie simplement le tableau ci-dessous.
//
//  Écrire un mot, 3 possibilités :
//
//    1) Juste le mot (les syllabes sont découpées automatiquement) :
//         "ciel",
//
//    2) Le mot avec des TIRETS là où tu veux couper les syllabes/sons.
//       Utile pour les sons piège ("ille", "eau", "ph"...) que le découpage
//       automatique gère mal. Le tiret n'est qu'une marque : le mot affiché
//       et à écrire reste "famille".
//         "fa-mille",
//
//    3) Avec un petit indice affiché à l'enfant (facultatif).
//       Le mot peut contenir des tirets ici aussi :
//         { mot: "mi-lieu", indice: "Le centre de quelque chose" },
//
//  Un mot d'une seule syllabe saute l'étape puzzle (rien à reconstruire).
// ===========================================================================

const MOTS = [
  "A-bel",
  "A-man-dine",
  "ci-el",
  { mot: "mi-lieu", indice: "Le centre de quelque chose" },
  "fa-mille",
  "fille",
  "yeux",
  "or-eilles",
  "chien",
  "pre-mier",
  "pre-mi-ère",
];
