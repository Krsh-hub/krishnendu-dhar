"use client";

import { useEffect, useRef } from "react";
import { getLenis, prefersReducedMotion } from "@/lib/motion";

const ROW_A = ["AI products", "Startups", "Pet-tech", "Voice agents", "Full-stack", "Late nights"];
const ROW_B = ["Next.js", "TypeScript", "Python", "Supabase", "Claude", "Three.js", "GSAP"];

function Row({ items, dir, className }: { items: string[]; dir: 1 | -1; className: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let skew = 0;
    let raf = 0;
    const loop = () => {
      const lenis = getLenis();
      const v = lenis?.velocity ?? 0;
      const scrollDir = lenis?.direction === -1 ? -1 : 1;
      x -= (0.7 + Math.abs(v) * 0.35) * dir * scrollDir;
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (Math.max(-12, Math.min(12, v * -0.25)) - skew) * 0.1;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  const content = [...items, ...items];
  return (
    <div className={`marquee-row ${className}`}>
      <div ref={track} className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-half" key={k} aria-hidden={k === 1 || undefined}>
            {content.map((t, i) => (
              <span key={i}>
                {t}
                <b>✺</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="marquee">
      <Row items={ROW_A} dir={1} className="is-accent" />
      <Row items={ROW_B} dir={-1} className="is-ink" />
    </section>
  );
}
