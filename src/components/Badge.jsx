import React from "react";

/**
 * Badge — a small chip for counts and labels: the 💎 diamond/XP counter in the
 * HUD, a "Mot 3/11" level pill, a "+10 💎" reward pop. Pixel display face.
 */
export function Badge({
  children,
  icon,
  tone = "diamond",
  outline = false,
  style,
  ...rest
}) {
  const tones = {
    diamond: { color: "var(--diamond)", bg: "#00000033" },
    gold: { color: "var(--gold)", bg: "#00000033" },
    cream: { color: "var(--cream)", bg: "#00000033" },
    ink: { color: "var(--ink)", bg: "var(--cream)" },
    good: { color: "#fff", bg: "var(--good-dark)" },
  };
  const t = tones[tone] || tones.diamond;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-display)",
        fontSize: "var(--display-md)",
        lineHeight: 1,
        color: t.color,
        background: outline ? "transparent" : t.bg,
        padding: outline ? 0 : "8px 12px",
        textShadow: tone === "ink" ? "none" : "var(--text-shadow-pixel)",
        whiteSpace: "nowrap",
        borderRadius: "var(--radius)",
        ...style,
      }}
      {...rest}
    >
      {icon ? <span style={{ fontSize: "1.15em" }}>{icon}</span> : null}
      {children}
    </span>
  );
}
