import React from "react";

/**
 * BlockPanel — a parchment "panel" surface: a flat fill framed by a bevelled
 * block border and a hard offset shadow. The container for any grouped content
 * (a screen card, a dialog body, a settings group).
 */
export function BlockPanel({
  children,
  tone = "paper",
  pad = "lg",
  pop = "md",
  style,
  ...rest
}) {
  const tones = {
    paper: { bg: "var(--surface-card)", color: "var(--text-ink)" },
    stone: { bg: "var(--stone)", color: "#fff" },
    grass: { bg: "var(--grass)", color: "var(--cream)" },
    obsidian: { bg: "var(--obsidian)", color: "var(--cream)" },
  };
  const t = tones[tone] || tones.paper;

  const pads = {
    sm: "var(--space-3)",
    md: "var(--space-5)",
    lg: "var(--space-6)",
    xl: "var(--space-8)",
  };
  const pops = {
    sm: "var(--pop-sm)",
    md: "var(--pop)",
    lg: "var(--pop-lg)",
  };

  return (
    <div
      style={{
        background: t.bg,
        color: t.color,
        padding: pads[pad] || pads.lg,
        border: "var(--block-border) solid",
        borderColor: "var(--bevel)",
        boxShadow: pops[pop] || pops.md,
        borderRadius: "var(--radius)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
