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
//  mots d'une seule syllabe n'en ont pas). Les mots SOULIGNÉS sur les fiches
//  de classe (= obligatoires, les plus importants) sont marqués `nether: true`
//  pour l'épreuve de rappel. Tu peux tout garder, ou n'activer qu'une liste à
//  la fois via l'éditeur ⚙️ sur l'accueil.
// ===========================================================================

export const MOTS = [
  // Liste 1 — le son [a]
  { mot: "a-vec", nether: true },
  { mot: "a-lors", nether: true },
  "a-vant",
  "a-près",
  { mot: "quatre", nether: true },
  { mot: "arbre", nether: true },
  { mot: "classe", nether: true },
  { mot: "parc", nether: true },
  "re-pas",

  // Liste 2 — le son [i]
  { mot: "i-ci", nether: true },
  "hier",
  "six",
  "dix",
  "sa-me-di",
  { mot: "pe-tit", nether: true },
  { mot: "gris", nether: true },
  "ville",
  { mot: "sou-ris", nether: true },
  { mot: "lit", nether: true },
  { mot: "ta-pis", nether: true },

  // Liste 3 — le son [oi]
  "voi-ci",
  { mot: "trois", nether: true },
  { mot: "noir", nether: true },
  "froid",
  "droit",
  { mot: "pour-quoi", nether: true },
  "oi-seau",
  { mot: "voi-ture", nether: true },
  { mot: "soir", nether: true },
  { mot: "é-toile", nether: true },
  "pois-son",
  { mot: "vo-ya-ge", nether: true },

  // Liste 4 — le son [ou]
  { mot: "bon-jour", nether: true },
  { mot: "tou-jours", nether: true },
  { mot: "sur-tout", nether: true },
  "au-jour-d'hui",
  { mot: "beau-coup", nether: true },
  "pour",
  "rouge",
  "doux",
  { mot: "jour", nether: true },
  { mot: "route", nether: true },
  { mot: "loup", nether: true },
  "cour",

  // Liste 5 — le son [o] (o / au / eau)
  "en-core",
  "comme",
  "com-ment",
  { mot: "jaune", nether: true },
  "gros",
  { mot: "cha-peau", nether: true },
  { mot: "homme", nether: true },
  "au-tomne",
  { mot: "eau", nether: true },
  { mot: "s'en-vo-ler", nether: true },

  // Liste 6 — le son [an] / [en]
  { mot: "sou-vent", nether: true },
  { mot: "pen-dant", nether: true },
  "en-semble",
  { mot: "grand", nether: true },
  "mé-chant",
  "blanc",
  { mot: "o-range", nether: true },
  { mot: "en-fant", nether: true },
  { mot: "temps", nether: true },
  "dent",
  "man-teau",

  // Liste 7 — le son [on] / [om]
  { mot: "com-bien", nether: true },
  "mar-ron",
  "con-tent",
  { mot: "a-vons", nether: true },
  { mot: "tom-bons", nether: true },
  { mot: "monde", nether: true },
  { mot: "ca-mion", nether: true },
  { mot: "pom-pier", nether: true },
  { mot: "rond", nether: true },
  { mot: "gar-çon", nether: true },
  "cham-pi-gnon",
  "nombre",

  // Liste 8 — le son [eu] / [œu]
  { mot: "deux", nether: true },
  { mot: "bleu", nether: true },
  "heu-reux",
  "vieux",
  { mot: "heure", nether: true },
  { mot: "che-veux", nether: true },
  { mot: "yeux", nether: true },
  { mot: "sœur", nether: true },
  "cœur",
  "feu",
  "peur",

  // Liste 9 — le son [k] (c / k / qu)
  "qui",
  "cô-té",
  "cha-que",
  { mot: "quand", nether: true },
  { mot: "va-can-ces", nether: true },
  { mot: "ski", nether: true },
  "corps",
  { mot: "coq", nether: true },
  "ca-deau",
  "cou-sin",
  "cou-sine",

  // Liste 10 — le son [é] (é / er / ez)
  { mot: "chez", nether: true },
  "dé-jà",
  { mot: "as-sez", nether: true },
  "der-nier",
  "pre-mier",
  "cher-chez",
  { mot: "clés", nether: true },
  { mot: "bé-bé", nether: true },
  { mot: "nez", nether: true },
  { mot: "é-té", nether: true },
  { mot: "é-lève", nether: true },
  "pied",

  // Liste 11 — le son [z]
  "zé-ro",
  "deu-xième",
  "di-xième",
  "rose",
  { mot: "bron-zent", nether: true },
  { mot: "chaise", nether: true },
  { mot: "mai-son", nether: true },
  { mot: "cui-sine", nether: true },
  { mot: "lé-zard", nether: true },
  { mot: "fraise", nether: true },
  "tré-sor",
  "voi-sin",

  // Liste 12 — le son [s]
  "en-suite",
  "sage",
  "seul",
  { mot: "so-leil", nether: true },
  { mot: "gla-çon", nether: true },
  { mot: "per-sonne", nether: true },
  "fils",
  { mot: "trousse", nether: true },
  "ce-rise",
  "ci-tron",
  { mot: "ré-cré-a-tion", nether: true },

  // Liste 13 — le son [ê] / [è] (ê / è / ai / ei / et / ë)
  { mot: "der-rière", nether: true },
  "très",
  "ja-mais",
  { mot: "vrai", nether: true },
  { mot: "fête", nether: true },
  { mot: "tête", nether: true },
  { mot: "se-maine", nether: true },
  { mot: "an-ni-ver-saire", nether: true },
  "crème",
  { mot: "o-reilles", nether: true },
  { mot: "ciel", nether: true },
  "fo-rêt",

  // Liste 14 — le son [in] (in / im / ein / ain)
  { mot: "de-main", nether: true },
  "sou-dain",
  { mot: "main-te-nant", nether: true },
  "en-fin",
  { mot: "jar-din", nether: true },
  "rai-sin",
  "main",
  { mot: "ma-tin", nether: true },
  { mot: "pain", nether: true },
  { mot: "prin-temps", nether: true },
  "co-pain",
  { mot: "faim", nether: true },
  { mot: "im-pos-sible", nether: true },
  "im-por-tant",
  "plein",

  // Liste 15 — le son [j] (ill / y / i)
  "bien",
  "rien",
  { mot: "fa-mille", nether: true },
  { mot: "fille", nether: true },
  { mot: "chien", nether: true },
  { mot: "mi-lieu", indice: "Le centre de quelque chose", nether: true },
  "a-vion",
  "feuille",
  { mot: "pre-mière", nether: true },
];
