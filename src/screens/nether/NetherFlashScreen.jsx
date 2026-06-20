import React from "react";
import { Screen } from "../Screen.jsx";
import { McLogo } from "../../components/McLogo.jsx";
import { Diamond } from "../../components/Diamond.jsx";

export function NetherFlashScreen({ word }) {
  return (
    <Screen>
      <div style={{ fontSize: 64, animation: "bob 0.8s ease-in-out infinite" }}>🔥</div>
      <McLogo nether style={{ fontSize: "var(--display-lg)" }}>De mémoire !</McLogo>
      <p style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "#ffd07a", margin: 0, display: "inline-flex", gap: 8, alignItems: "center" }}>
        «&nbsp;{word.mot}&nbsp;» — +15 <Diamond size={20} />
      </p>
    </Screen>
  );
}
