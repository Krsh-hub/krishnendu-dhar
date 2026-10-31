"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="magnetic">
      {children}
    </div>
  );
}

/** Text that rolls its letters up on hover (pure CSS, see .roll in globals.css). */
export function Roll({ text }: { text: string }) {
  const chars = [...text];
  const row = (hidden?: boolean) => (
    <span className="roll-row" aria-hidden={hidden || undefined}>
      {chars.map((c, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      {row(true)}
      {row(true)}
    </span>
  );
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Scrambles an element's text, resolving left to right. */
export function scramble(el: HTMLElement, finalText: string, duration = 0.8) {
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const reveal = Math.floor(state.p * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        if (i < reveal || finalText[i] === " ") out += finalText[i];
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
  });
}

export function SectionLabel({ n, children, light }: { n: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`section-label${light ? " is-light" : ""}`}>
      <span>({n})</span>
      <span>{children}</span>
    </div>
  );
}
