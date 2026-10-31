"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "./ui";

type P = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; heat: number };

const WORDS = ["PLAY", "KRISH", "BUILD", "SHIP", "HELLO"];

export default function Playground() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [word, setWord] = useState(0);
  const [hits, setHits] = useState(0);

  useGSAP(
    () => {
      gsap.from(".play-head .big > span", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".play-head", start: "top 80%" },
      });
      gsap.fromTo(
        ".play-stage",
        { clipPath: "inset(12% 12% 12% 12% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: ".play-stage", start: "top bottom", end: "top 25%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    const mouse = { x: -9999, y: -9999, down: false };

    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-anton").trim() || "Impact";

    const build = () => {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const text = WORDS[word];
      let size = h * 0.72;
      o.font = `${size}px ${font}`;
      const tw = o.measureText(text).width;
      if (tw > w * 0.88) size *= (w * 0.88) / tw;
      o.font = `${size}px ${font}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText(text, w / 2, h / 2 + size * 0.04);

      const data = o.getImageData(0, 0, w, h).data;
      const gap = w < 700 ? 5 : 7;
      const next: P[] = [];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            const prev = particles[next.length];
            next.push({
              x: prev ? prev.x : Math.random() * w,
              y: prev ? prev.y : Math.random() * h,
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
              heat: 0,
            });
          }
        }
      }
      particles = next;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      const R = mouse.down ? 160 : 100;
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (R - d) / R;
          p.vx += (dx / d) * f * (mouse.down ? 9 : 4);
          p.vy += (dy / d) * f * (mouse.down ? 9 : 4);
          p.heat = 1;
        }
        p.vx += (p.ox - p.x) * 0.045;
        p.vy += (p.oy - p.y) * 0.045;
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;
        p.heat *= 0.96;
        const s = 2.4 + p.heat * 2.2;
        ctx.fillStyle = p.heat > 0.05 ? `rgba(255,${74 + (1 - p.heat) * 160},${28 + (1 - p.heat) * 200},1)` : "#ECE9E2";
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
    };

    const setPos = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const down = (e: PointerEvent) => {
      setPos(e);
      mouse.down = true;
      setHits((n) => n + 1);
      // Shockwave
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = Math.max(0, 1 - d / 500) * 38;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
        p.heat = Math.max(p.heat, f / 38);
      }
    };
    const up = () => (mouse.down = false);
    const leave = () => {
      mouse.x = mouse.y = -9999;
      mouse.down = false;
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    const ro = new ResizeObserver(() => build());
    ro.observe(cv);

    document.fonts.ready.then(build);
    cv.addEventListener("pointermove", setPos);
    cv.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    cv.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener("pointermove", setPos);
      cv.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      cv.removeEventListener("pointerleave", leave);
    };
  }, [word]);

  return (
    <section id="play" ref={root} className="play">
      <div className="play-head">
        <SectionLabel n="04" light>
          Fun stuff
        </SectionLabel>
        <h2 className="big">
          <span>Go on,</span> <span>
            <em>touch it</em>
          </span>
        </h2>
        <p>Move to push the pixels around. Click for a shockwave. Every pixel springs back home.</p>
      </div>
      <div className="play-stage">
        <canvas ref={canvas} className="play-canvas" data-cursor="CLICK" />
        <div className="play-ui">
          <span>Shockwaves: {String(hits).padStart(3, "0")}</span>
          <div className="play-words">
            {WORDS.map((w, i) => (
              <button key={w} className={i === word ? "is-on" : ""} onClick={() => setWord(i)}>
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
