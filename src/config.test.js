import { describe, it, expect, beforeEach } from "vitest";
import { defaultMots, loadConfig, saveConfig } from "./config.js";

// Vitest tourne en environnement node : pas de localStorage natif.
// On installe un mock minimal en mémoire avant chaque test.
beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
});

describe("config : champ actif", () => {
  it("defaultMots met actif:true partout", () => {
    expect(defaultMots().every((m) => m.actif === true)).toBe(true);
  });

  it("saveConfig puis loadConfig conserve actif:false", () => {
    saveConfig({
      prenom: "Léa",
      mots: [
        { mot: "chat", indice: "", nether: false, actif: true },
        { mot: "souris", indice: "", nether: false, actif: false },
      ],
    });
    const cfg = loadConfig();
    expect(cfg.prenom).toBe("Léa");
    expect(cfg.mots.map((m) => m.actif)).toEqual([true, false]);
  });

  it("une entrée persistée sans actif est considérée active (rétrocompat)", () => {
    localStorage.setItem(
      "motsblocs-config-v1",
      JSON.stringify({ prenom: "", mots: [{ mot: "chat", indice: "", nether: false }] })
    );
    expect(loadConfig().mots[0].actif).toBe(true);
  });
});
