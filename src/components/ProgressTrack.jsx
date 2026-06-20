import React from "react";

/**
 * ProgressTrack — an inset stone "well" with a diamond fill, used in the HUD to
 * show how far through the word list the child is.
 */
export function ProgressTrack({ value = 0, max = 100, height = 16, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      style={{
        height,
        background: "var(--progress-track)",
        border: "var(--block-border-thin) solid #00000088",
        borderColor: "var(--bevel-inset)",
        boxShadow: "var(--inset-sheen)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          height: "100%",
          width: pct + "%",
          background: "var(--progress-fill)",
          transition: "width var(--t-progress)",
        }}
      />
    </div>
  );
}
