"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { featured, type Project } from "@/lib/content";
import { Magnetic, SectionLabel } from "./ui";

function Motif({ kind }: { kind: Project["motif"] }) {
  switch (kind) {
    case "rings":
      return (
        <svg viewBox="0 0 400 400" className="motif motif-spin">
          {[40, 80, 120, 160, 190].map((r) => (
            <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={r % 80 === 0 ? "4 10" : undefined} />
          ))}
          <circle cx="200" cy="200" r="14" fill="currentColor" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 400 400" className="motif">
          {Array.from({ length: 64 }, (_, i) => (
            <rect key={i} className="motif-cell" x={(i % 8) * 50 + 8} y={Math.floor(i / 8) * 50 + 8} width="34" height="34" fill="currentColor" style={{ animationDelay: `${((i * 37) % 64) * 0.06}s` }} />
          ))}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 400 400" className="motif">
          {Array.from({ length: 28 }, (_, i) => (
            <rect key={i} className="motif-bar" x={i * 14 + 4} y="100" width="7" height="200" rx="3.5" fill="currentColor" style={{ animationDelay: `${i * -0.09}s` }} />
          ))}
        </svg>
      );
    case "orbit":
      return (
        <svg viewBox="0 0 400 400" className="motif motif-spin-slow">
          <ellipse cx="200" cy="200" rx="180" ry="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="200" cy="200" rx="180" ry="70" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 200 200)" />
          <ellipse cx="200" cy="200" rx="180" ry="70" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 200 200)" />
          <text x="200" y="228" textAnchor="middle" fontSize="80" fontStyle="italic" fill="currentColor" fontFamily="serif">
            ¶
          </text>
        </svg>
      );
    case "bars":
      return (
        <svg viewBox="0 0 400 400" className="motif">
          {[0.35, 0.55, 0.42, 0.7, 0.62, 0.88].map((h, i) => (
            <rect key={i} className="motif-grow" x={i * 64 + 10} y={380 - h * 340} width="44" height={h * 340} fill="currentColor" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
          <path d="M20 300 L90 240 L150 270 L220 160 L290 190 L370 60" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
  }
}

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <article className="wc" style={{ "--bg": p.bg, "--fg": p.fg } as React.CSSProperties}>
      <div className="wc-top">
        <span>
          {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
        </span>
        <span>{p.kicker}</span>
        <span>{p.year}</span>
      </div>
      <div className="wc-motif">
        <Motif kind={p.motif} />
      </div>
      <h3 className="wc-title">{p.title}</h3>
      <div className="wc-bottom">
        <p>{p.blurb}</p>
        <div className="wc-side">
          <ul className="wc-tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="wc-links">
            {p.live && (
              <Magnetic>
                <a href={p.live} target="_blank" rel="noreferrer" data-cursor="VISIT">
                  Live ↗
                </a>
              </Magnetic>
            )}
            {p.repo && (
              <Magnetic>
                <a href={p.repo} target="_blank" rel="noreferrer" data-cursor="CODE">
                  Code ↗
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".work-head .big > span", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".work-head", start: "top 80%" },
      });

      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal scroll
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".work-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".work-pin",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(".work-progress i", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".work-pin", start: "top top", end: () => `+=${distance()}`, scrub: true },
        });

        gsap.utils.toArray<HTMLElement>(".wc").forEach((card) => {
          const st = { trigger: card, containerAnimation: tween, scrub: true };
          gsap.fromTo(card.querySelector(".wc-title"), { xPercent: 25 }, { xPercent: -10, ease: "none", scrollTrigger: { ...st, start: "left right", end: "right left" } });
          gsap.fromTo(card.querySelector(".wc-motif"), { rotate: -25, scale: 0.7 }, { rotate: 15, scale: 1.1, ease: "none", scrollTrigger: { ...st, start: "left right", end: "right left" } });
          gsap.fromTo(card, { rotate: 4, scale: 0.9 }, { rotate: 0, scale: 1, ease: "none", scrollTrigger: { ...st, start: "left right", end: "left 30%" } });
        });
      });

      // Mobile: stacked cards that rise in
      mm.add("(max-width: 899px)", () => {
        gsap.utils.toArray<HTMLElement>(".wc").forEach((card) => {
          gsap.from(card, { y: 80, rotate: 3, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 90%" } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="work">
      <div className="work-head">
        <SectionLabel n="02" light>
          Selected work
        </SectionLabel>
        <h2 className="big">
          <span>Things</span> <span>
            I&apos;ve <em>built</em>
          </span>
        </h2>
        <p className="work-intro">Startups, AI products and experiments, from a smart collar to agents that argue with you.</p>
      </div>
      <div className="work-pin">
        <div className="work-track">
          {featured.map((p, i) => (
            <Card key={p.title} p={p} i={i} />
          ))}
          <div className="wc-end">
            <span>More below</span>
            <b>↓</b>
          </div>
        </div>
        <div className="work-progress">
          <i />
        </div>
      </div>
    </section>
  );
}
