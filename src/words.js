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
//    3) Avec un petit indice affiché à l'enfant (facultatif), et/ou en le
//       marquant `nether: true` pour qu'il fasse partie de l'épreuve Nether
//       (rappel de mémoire, à la fin) :
//         { mot: "mi-lieu", indice: "Le centre de quelque chose", nether: true },
//
//  Un mot d'une seule syllabe saute l'étape puzzle (rien à reconstruire).
//  Si aucun mot n'est marqué `nether: true`, le portail Nether n'apparaît pas.
//
//  ⚠️ Le tiret servant à découper les syllabes, on ne peut PAS écrire un mot
//  qui contient un vrai trait d'union ("peut-être", "grand-mère") : il serait
//  pris pour une coupure et disparaîtrait du mot à écrire.
//
//  Ci-dessous : les 15 listes de dictée CE1 travaillées en classe, regroupées
//  par son, avec le découpage des syllabes déjà indiqué par des tirets (les
//  mots d'une seule syllabe n'en ont pas). Tu peux tout garder, ou n'activer
//  qu'une liste à la fois via l'éditeur ⚙️ sur l'accueil.
// ===========================================================================

export const MOTS = [
  // Liste 1 — le son [a]
  "a-vec",
  "a-lors",
  "a-vant",
  "a-près",
  "quatre",
  "arbre",
  "classe",
  "parc",
  "re-pas",

  // Liste 2 — le son [i]
  "i-ci",
  "hier",
  "six",
  "dix",
  "sa-me-di",
  "pe-tit",
  "gris",
  "ville",
  "sou-ris",
  "lit",
  "ta-pis",

  // Liste 3 — le son [oi]
  "voi-ci",
  "trois",
  "noir",
  "froid",
  "droit",
  "pour-quoi",
  "oi-seau",
  "voi-ture",
  "soir",
  "é-toile",
  "pois-son",
  "vo-ya-ge",

  // Liste 4 — le son [ou]
  "bon-jour",
  "tou-jours",
  "sur-tout",
  "au-jour-d'hui",
  "beau-coup",
  "pour",
  "rouge",
  "doux",
  "jour",
  "route",
  "loup",
  "cour",

  // Liste 5 — le son [o] (o / au / eau)
  "en-core",
  "comme",
  "com-ment",
  "jaune",
  "gros",
  "cha-peau",
  "homme",
  "au-tomne",
  "eau",
  "s'en-vo-ler",

  // Liste 6 — le son [an] / [en]
  "sou-vent",
  "pen-dant",
  "en-semble",
  "grand",
  "mé-chant",
  "blanc",
  "o-range",
  "en-fant",
  "temps",
  "dent",
  "man-teau",

  // Liste 7 — le son [on] / [om]
  "com-bien",
  "mar-ron",
  "con-tent",
  "a-vons",
  "tom-bons",
  "monde",
  "ca-mion",
  "pom-pier",
  "rond",
  "gar-çon",
  "cham-pi-gnon",
  "nombre",

  // Liste 8 — le son [eu] / [œu]
  "deux",
  "bleu",
  "heu-reux",
  "vieux",
  "heure",
  "che-veux",
  "yeux",
  "sœur",
  "cœur",
  "feu",
  "peur",

  // Liste 9 — le son [k] (c / k / qu)
  "qui",
  "cô-té",
  "cha-que",
  "quand",
  "va-can-ces",
  "ski",
  "corps",
  "coq",
  "ca-deau",
  "cou-sin",
  "cou-sine",

  // Liste 10 — le son [é] (é / er / ez)
  "chez",
  "dé-jà",
  "as-sez",
  "der-nier",
  "pre-mier",
  "cher-chez",
  "clés",
  "bé-bé",
  "nez",
  "é-té",
  "é-lève",
  "pied",

  // Liste 11 — le son [z]
  "zé-ro",
  "deu-xième",
  "di-xième",
  "rose",
  "bron-zent",
  "chaise",
  "mai-son",
  "cui-sine",
  "lé-zard",
  "fraise",
  "tré-sor",
  "voi-sin",

  // Liste 12 — le son [s]
  "en-suite",
  "sage",
  "seul",
  "so-leil",
  "gla-çon",
  "per-sonne",
  "fils",
  "trousse",
  "ce-rise",
  "ci-tron",
  "ré-cré-a-tion",

  // Liste 13 — le son [ê] / [è] (ê / è / ai / ei / et / ë)
  "der-rière",
  "très",
  "ja-mais",
  "vrai",
  "fête",
  "tête",
  "se-maine",
  "an-ni-ver-saire",
  "crème",
  "o-reilles",
  "ciel",
  "fo-rêt",

  // Liste 14 — le son [in] (in / im / ein / ain)
  "de-main",
  "sou-dain",
  "main-te-nant",
  "en-fin",
  "jar-din",
  "rai-sin",
  "main",
  "ma-tin",
  "pain",
  "prin-temps",
  "co-pain",
  "faim",
  "im-pos-sible",
  "im-por-tant",
  "plein",

  // Liste 15 — le son [j] (ill / y / i)
  "bien",
  "rien",
  "fa-mille",
  { mot: "fille", nether: true },
  "chien",
  { mot: "mi-lieu", indice: "Le centre de quelque chose", nether: true },
  "a-vion",
  "feuille",
  "pre-mière",
];
