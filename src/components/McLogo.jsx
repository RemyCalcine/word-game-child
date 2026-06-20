import React from "react";

export function McLogo({ children, nether = false, style }) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 6vw, 38px)",
        color: nether ? "#ffb070" : "#d2d2d2",
        WebkitTextStroke: nether ? "3px #1a0606" : "3px #15110d",
        paintOrder: "stroke fill",
        textShadow: nether
          ? "0 3px 0 #d4651a, 0 6px 0 #a8460c, 0 9px 0 #6e2b08, 0 12px 0 #3a1404, 0 0 22px #ff6a1f99, 0 15px 12px rgba(0,0,0,.5)"
          : "0 3px 0 #8f8f8f, 0 6px 0 #6c6c6c, 0 9px 0 #4a4a4a, 0 12px 0 #2a2a2a, 0 15px 10px rgba(0,0,0,.45)",
        letterSpacing: 1,
        lineHeight: 1.5,
        margin: 0,
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </h1>
  );
}
