import React from "react";

/**
 * SyllableTile — a clickable cream block holding a syllable, used in the
 * "rebuild the word" puzzle. Also renders as a slot (the target) when `slot`
 * is set. States: default, disabled (already placed), hint (pulsing), filled.
 */
export function SyllableTile({
  children,
  slot = false,
  state = "default",
  onClick,
  style,
  ...rest
}) {
  const base = {
    minWidth: "var(--tile-syllable-min)",
    height: "var(--tile-syllable-h)",
    padding: "0 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-text)",
    fontSize: "var(--tile-syllable-size)",
    fontWeight: "var(--weight-black)",
    textTransform: "lowercase",
    color: "var(--tile-ink)",
    borderRadius: "var(--radius)",
  };

  // ---- Slot (drop target) -------------------------------------------------
  if (slot) {
    const filled = state === "filled";
    return (
      <div
        style={{
          ...base,
          background: filled ? "var(--tile-correct)" : "#ffffff28",
          color: filled ? "var(--good-ink)" : "var(--tile-ink)",
          border: filled
            ? "var(--block-border) solid"
            : "var(--block-border) dashed",
          borderColor: filled ? "var(--bevel)" : "#ffffff66",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }

  // ---- Tile (clickable bank piece) ---------------------------------------
  const disabled = state === "disabled";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={"lmb-syll-tile block-tex" + (state === "hint" ? " is-hint" : "")}
      style={{
        ...base,
        backgroundColor: "var(--tile-face)",
        backgroundImage: "var(--tex-letter)",
        backgroundSize: "cover",
        border: "var(--block-border) solid",
        borderColor: "var(--bevel)",
        boxShadow: disabled ? "var(--pop-pressed)" : "var(--pop)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        transform: disabled ? "translateY(3px)" : "none",
        transition:
          "transform var(--t-press), box-shadow var(--t-press), filter var(--t-quick), opacity var(--t-quick)",
        ...style,
      }}
      {...rest}
    >
      {children}
      <style>{`
        .lmb-syll-tile:not(:disabled):hover { filter: brightness(1.06); }
        .lmb-syll-tile:not(:disabled):active {
          transform: translateY(3px);
          box-shadow: var(--pop-pressed);
        }
        .lmb-syll-tile.is-hint { animation: lmb-clignote 0.7s ease-in-out infinite; }
        @keyframes lmb-clignote {
          0%, 100% { box-shadow: var(--pop); }
          50% { box-shadow: var(--pop), inset 0 0 0 100px var(--tile-active); }
        }
      `}</style>
    </button>
  );
}
