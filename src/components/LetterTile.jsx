import React from "react";

/**
 * LetterTile — one cream "block" holding a single letter, the atom of the game.
 * States mirror the real game: empty (placeholder), filled (typed), good/bad
 * (correctness feedback), active (being spelled / highlighted).
 */
export function LetterTile({
  letter = "",
  state = "filled",
  size = "md",
  style,
  ...rest
}) {
  const dim = size === "sm" ? "var(--tile-letter-sm)" : "var(--tile-letter)";

  const palettes = {
    empty: { bg: "#ffffff30", color: "transparent" },
    filled: { bg: "var(--tile-face)", color: "var(--tile-ink)" },
    good: { bg: "var(--tile-correct)", color: "var(--good-ink)" },
    bad: { bg: "var(--tile-wrong)", color: "#fff" },
    active: { bg: "var(--tile-active)", color: "var(--tile-ink)" },
  };
  const p = palettes[state] || palettes.filled;
  const isActive = state === "active";
  const isFilled = state === "filled" || !palettes[state];

  return (
    <div
      className={"lmb-letter-tile" + (isFilled ? " block-tex" : "")}
      style={{
        width: dim,
        height: dim,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-text)",
        fontSize: "var(--tile-letter-size)",
        fontWeight: "var(--weight-black)",
        textTransform: "lowercase",
        color: p.color,
        background: isFilled ? "var(--tile-face)" : p.bg,
        backgroundImage: isFilled ? "var(--tex-letter)" : undefined,
        backgroundSize: isFilled ? "cover" : undefined,
        border: "var(--block-border) solid",
        borderColor: state === "empty" ? "#00000033" : "var(--bevel)",
        boxShadow: state === "empty" ? "var(--inset-sheen)" : "var(--pop-sm)",
        borderRadius: "var(--radius)",
        transform: isActive ? "translateY(-8px) scale(1.08)" : "none",
        transition: "transform var(--t-quick), background var(--t-quick)",
        ...style,
      }}
      {...rest}
    >
      {state === "empty" ? "" : letter}
    </div>
  );
}
