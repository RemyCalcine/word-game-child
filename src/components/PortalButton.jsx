import React from "react";

/**
 * PortalButton — a Nether portal as a button. An obsidian frame around a
 * shimmering purple portal interior, with a pulsing violet glow. Used on the
 * end screen to enter the dark "Nether" recall challenge.
 */
export function PortalButton({ children, onClick, size = "md", style, ...rest }) {
  const sizes = {
    sm: { pad: "10px 18px", font: "var(--display-sm)", frame: 8 },
    md: { pad: "16px 26px", font: "var(--display-md)", frame: 10 },
    lg: { pad: "22px 34px", font: "var(--display-lg)", frame: 12 },
  };
  const sz = sizes[size] || sizes.md;

  return (
    <button
      type="button"
      onClick={onClick}
      className="lmb-portal"
      style={{
        position: "relative",
        padding: sz.frame,
        background: "var(--tex-obsidian)",
        backgroundSize: "32px 32px",
        imageRendering: "pixelated",
        border: "var(--block-border) solid",
        borderColor: "var(--bevel)",
        boxShadow: "var(--pop), 0 0 0 2px #00000066, 0 0 28px 4px #a64ad688",
        borderRadius: "var(--radius)",
        cursor: "pointer",
        transition:
          "transform var(--t-press), box-shadow var(--t-quick), filter var(--t-quick)",
        ...style,
      }}
      {...rest}
    >
      <span
        className="lmb-portal-inner"
        style={{
          display: "block",
          padding: sz.pad,
          fontFamily: "var(--font-display)",
          fontSize: sz.font,
          lineHeight: 1.5,
          color: "#fff",
          textShadow: "0 0 8px #e6a8ff, 0 2px 0 #3a0a55, 2px 2px 0 #00000088",
          background:
            "linear-gradient(125deg, #2a0d44 0%, #6a1f9e 30%, #b14ad6 50%, #6a1f9e 70%, #2a0d44 100%)",
          backgroundSize: "260% 260%",
          boxShadow: "inset 0 0 22px 4px #d77bff66, inset 0 0 0 2px #1a0828",
          borderRadius: "var(--radius)",
        }}
      >
        {children}
      </span>
      <style>{`
        .lmb-portal:hover { filter: brightness(1.12); box-shadow: var(--pop), 0 0 0 2px #00000066, 0 0 38px 8px #c060f0aa; }
        .lmb-portal:active { transform: translateY(4px); box-shadow: var(--pop-pressed), 0 0 24px 4px #a64ad6aa; }
        .lmb-portal .lmb-portal-inner { animation: lmb-portal-shift 5s ease-in-out infinite; }
        @keyframes lmb-portal-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lmb-portal .lmb-portal-inner { animation: none; }
        }
      `}</style>
    </button>
  );
}
