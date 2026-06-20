import React from "react";

/**
 * BlockButton — the signature Minecraft "block" button.
 * A flat fill + bevelled relief border + a hard offset shadow that compresses
 * on press (the button physically sinks 4px into its own shadow).
 */
export function BlockButton({
  children,
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}) {
  const fills = {
    primary: ["var(--action-primary)", "var(--action-primary-edge)"],
    secondary: ["var(--action-secondary)", "var(--action-secondary-edge)"],
    reward: ["var(--action-reward)", "var(--action-reward-edge)"],
    danger: ["var(--action-danger)", "var(--action-danger-edge)"],
    neutral: ["var(--action-neutral)", "var(--action-neutral-edge)"],
  };
  const [fill] = fills[variant] || fills.primary;
  const rewardInk = variant === "reward" ? "var(--ink)" : "#fff";

  const sizes = {
    sm: { fontSize: "var(--display-sm)", padding: "10px 14px" },
    md: { fontSize: "var(--display-md)", padding: "16px 22px" },
    lg: { fontSize: "var(--display-lg)", padding: "20px 28px" },
  };
  const sz = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="lmb-block-btn"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: sz.fontSize,
        lineHeight: 1,
        color: rewardInk,
        background: fill,
        padding: sz.padding,
        width: block ? "100%" : "auto",
        border: "var(--block-border) solid",
        borderColor: "var(--bevel)",
        boxShadow: "var(--pop)",
        textShadow: variant === "reward" ? "none" : "var(--text-shadow-pixel)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        borderRadius: "var(--radius)",
        transition:
          "transform var(--t-press), box-shadow var(--t-press), filter var(--t-quick)",
        ...style,
      }}
      {...rest}
    >
      {children}
      <style>{`
        .lmb-block-btn:not(:disabled):hover { filter: brightness(1.08); }
        .lmb-block-btn:not(:disabled):active {
          transform: translateY(4px);
          box-shadow: var(--pop-pressed);
        }
      `}</style>
    </button>
  );
}
