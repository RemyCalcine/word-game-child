import React from "react";
import { IconButton } from "./IconButton.jsx";
import { ProgressTrack } from "./ProgressTrack.jsx";
import { Badge } from "./Badge.jsx";

/**
 * HudBar — the top game banner: a back arrow, the "Mot n/total" label over a
 * progress track, and the 💎 XP counter. Composes IconButton + ProgressTrack +
 * Badge. The back arrow keeps its slot when hidden (first word).
 */
export function HudBar({
  index = 0,
  total = 1,
  xp = 0,
  canGoBack = true,
  onBack,
  style,
  ...rest
}) {
  return (
    <header
      style={{
        width: "100%",
        maxWidth: "var(--content-max)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
        ...style,
      }}
      {...rest}
    >
      <IconButton title="Revenir" hidden={!canGoBack} onClick={onBack}>
        ←
      </IconButton>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--display-xs)",
            color: "var(--cream)",
            textShadow: "var(--text-shadow-pixel)",
            marginBottom: "var(--space-2)",
          }}
        >
          {"Mot " + (index + 1) + " / " + total}
        </div>
        <ProgressTrack value={index} max={total} />
      </div>

      <Badge icon="💎" tone="diamond" outline>
        {xp}
      </Badge>
    </header>
  );
}
