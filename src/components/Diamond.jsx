import React from "react";
import diamondIcon from "../assets/icons/diamond.png";

export function Diamond({ size = 22, style }) {
  return (
    <img
      src={diamondIcon}
      alt="diamant"
      style={{ width: size, height: size, imageRendering: "pixelated", verticalAlign: "-0.18em", ...style }}
    />
  );
}
