import React from "react";

export function StepLabel({ children, style }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "var(--display-lg)",
        color: "var(--cream)",
        textShadow: "var(--text-shadow-pixel)",
        margin: 0,
        textAlign: "center",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
