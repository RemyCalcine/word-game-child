import { describe, it, expect } from "vitest";
import { normaliser, decouperAuto, prepareList } from "./wordList.js";

describe("decouperAuto", () => {
  it("découpe un mot simple en syllabes V-CV", () => {
    expect(decouperAuto("chien")).toEqual(["chien"]); // pas de 2e noyau vocalique séparé -> ei est un seul noyau
  });
  it("garde les groupes de consonnes inséparables ensemble", () => {
    expect(decouperAuto("fille")).toEqual(["fille"]); // "e" muet final rattaché
  });
  it("coupe entre deux noyaux vocaliques séparés par une seule consonne", () => {
    // "oreilles" a 3 noyaux vocaliques (o / ei / e) → 2 coupes, pas 1.
    // C'est pour ça que words.js corrige ce mot manuellement en "or-eilles"
    // (son piège documenté dans le commentaire d'en-tête de words.js).
    expect(decouperAuto("oreilles")).toEqual(["o", "reil", "les"]);
  });
  it("retourne le mot entier s'il n'y a qu'un seul noyau vocalique", () => {
    expect(decouperAuto("yeux")).toEqual(["yeux"]);
  });
});

describe("normaliser", () => {
  it("accepte une chaîne simple", () => {
    const r = normaliser("ciel");
    expect(r).toEqual({ mot: "ciel", indice: "", syllabes: ["ciel"], nether: false });
  });
  it("respecte les tirets du parent comme découpage syllabes", () => {
    const r = normaliser("fa-mille");
    expect(r.mot).toBe("famille");
    expect(r.syllabes).toEqual(["fa", "mille"]);
  });
  it("accepte un objet avec indice et nether", () => {
    const r = normaliser({ mot: "mi-lieu", indice: "Le centre", nether: true });
    expect(r).toEqual({ mot: "milieu", indice: "Le centre", syllabes: ["mi", "lieu"], nether: true });
  });
});

describe("prepareList", () => {
  it("filtre les entrées vides et garde l'ordre", () => {
    const r = prepareList(["chien", "  ", "fille"]);
    expect(r.map((w) => w.mot)).toEqual(["chien", "fille"]);
  });
});
