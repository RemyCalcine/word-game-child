import React from "react";

export function GroundBackground({ nether = false }) {
  if (nether) {
    const embers = Array.from({ length: 9 }, (_, i) => i);
    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: -1, overflow: "hidden",
          background: "radial-gradient(120% 90% at 50% 118%, #b8480c66 0%, #2a0f0c 48%, #160a14 100%)",
        }}
      >
        <div className="block-tex" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "26%", backgroundImage: "var(--tex-netherrack)", backgroundSize: "48px 48px", opacity: 0.85, WebkitMaskImage: "linear-gradient(#000, transparent)", maskImage: "linear-gradient(#000, transparent)" }} />
        <div className="block-tex" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "32%", backgroundImage: "var(--tex-nether-ground)", backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", bottom: "32%", left: 0, right: 0, height: 10, background: "linear-gradient(90deg,#ff7a1f,#ffb43c,#ff5a1f,#ffb43c,#ff7a1f)", boxShadow: "0 0 26px 8px #ff6a1faa, 0 -2px 0 #00000088" }} />
        {embers.map((i) => (
          <span key={i} style={{ position: "absolute", bottom: "30%", left: 8 + i * 11 + "%", width: 4, height: 4, background: i % 2 ? "#ffd07a" : "#ff7a2a", boxShadow: "0 0 6px 2px #ff8a3a88", animation: `ember ${4 + (i % 4)}s linear ${i * 0.6}s infinite` }} />
        ))}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 200px 60px #000a" }} />
      </div>
    );
  }
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "44%", background: "linear-gradient(180deg, var(--sky-top), var(--sky-bottom))" }}>
        <span style={{ position: "absolute", top: "26%", left: "14%", width: 110, height: 26, background: "#ffffffcc", boxShadow: "26px 0 0 #ffffffcc, -20px 14px 0 #ffffffbb, 40px 12px 0 #ffffffbb" }} />
        <span style={{ position: "absolute", top: "52%", left: "66%", width: 84, height: 22, background: "#ffffffbb", boxShadow: "22px 0 0 #ffffffbb, -16px 12px 0 #ffffffaa" }} />
      </div>
      <div className="block-tex" style={{ position: "absolute", top: "44%", left: 0, right: 0, bottom: 0, backgroundColor: "var(--dirt)", backgroundImage: "var(--tex-dirt)", backgroundSize: "48px 48px" }} />
      <div className="block-tex" style={{ position: "absolute", top: "44%", left: 0, right: 0, height: 30, backgroundColor: "var(--grass)", backgroundImage: "var(--tex-grass-top)", backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: "44%", left: 0, right: 0, height: 7, backgroundColor: "var(--grass-light)" }} />
      <div style={{ position: "absolute", top: "calc(44% + 30px)", left: 0, right: 0, height: 16, background: "repeating-linear-gradient(90deg, var(--grass) 0 16px, transparent 16px 32px)" }} />
      <div style={{ position: "absolute", top: "calc(44% + 30px)", left: 0, right: 0, height: 9, background: "repeating-linear-gradient(90deg, transparent 0 16px, var(--grass-dark) 16px 32px)" }} />
    </div>
  );
}
