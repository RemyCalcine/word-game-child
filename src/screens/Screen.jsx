import React from "react";

export function Screen({ children }) {
  return (
    <section
      style={{
        width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", gap: "var(--space-6)",
        animation: "pop var(--t-pop)", textAlign: "center",
      }}
    >
      {children}
    </section>
  );
}
