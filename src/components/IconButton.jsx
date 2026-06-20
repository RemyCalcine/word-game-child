import React from "react";

/**
 * IconButton — a square block button for a single glyph or emoji.
 * Same block physics as BlockButton: bevel + hard shadow that sinks on press.
 * Used for the HUD back arrow (←) and inline "listen again" (🔊) controls.
 */
export function IconButton({
  children,
  variant = "neutral",
  size = "md",
  disabled = false,
  hidden = false,
  title,
  onClick,
  style,
  ...rest
}) {
  const fills = {
    neutral: "var(--action-neutral)",
    primary: "var(--action-primary)",
    secondary: "var(--action-secondary)",
    danger: "var(--action-danger)",
  };
  const fill = fills[variant] || fills.neutral;

  const sizes = { sm: 40, md: 48, lg: 58 };
  const dim = sizes[size] || sizes.md;

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="lmb-icon-btn"
      style={{
        flex: "none",
        width: dim,
        height: dim,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: dim >= 58 ? 22 : dim >= 48 ? 18 : 15,
        color: "#fff",
        background: fill,
        border: "var(--block-border) solid",
        borderColor: "var(--bevel)",
        boxShadow: "var(--pop-sm)",
        textShadow: "var(--text-shadow-pixel)",
        cursor: disabled ? "default" : "pointer",
        borderRadius: "var(--radius)",
        // keep layout space when hidden (matches the game's visibility trick)
        visibility: hidden ? "hidden" : "visible",
        opacity: disabled ? 0.45 : 1,
        transition:
          "transform var(--t-press), box-shadow var(--t-press), filter var(--t-quick)",
        ...style,
      }}
      {...rest}
    >
      {children}
      <style>{`
        .lmb-icon-btn:not(:disabled):hover { filter: brightness(1.1); }
        .lmb-icon-btn:not(:disabled):active {
          transform: translateY(3px);
          box-shadow: var(--pop-pressed);
        }
      `}</style>
    </button>
  );
}
