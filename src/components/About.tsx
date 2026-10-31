"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "./ui";

// Words wrapped in *asterisks* get the serif-italic accent treatment.
const MANIFESTO =
  "I'm Krishnendu, a founder and builder from Kolkata. I make *AI products* people actually use: a smart collar that notices when a pet is unwell before anyone else does, voice agents that *argue back* and tools that keep small businesses running. Pressure, late nights, and half-formed ideas are how I like to work, and I keep going until *they ship.*";

const FACTS = [
  ["Now", "Building CURAA, a smart collar for pets"],
  ["Also", "An EdTech venture, still in stealth"],
  ["Stack", "TypeScript · Python · Next.js · Supabase · LLMs"],
  ["Repos", "30+ public experiments on GitHub"],
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-text .word",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 55%", scrub: true },
        },
      );

      gsap.fromTo(
        ".about-photo",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "expo.inOut",
          duration: 1.6,
          scrollTrigger: { trigger: ".about-photo", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".about-photo img",
        { scale: 1.35, yPercent: -8 },
        {
          scale: 1.05,
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ".about-photo", start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      gsap.from(".fact", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".facts", start: "top 85%" },
      });
      gsap.from(".fact-line", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.2,
        ease: "expo.inOut",
        stagger: 0.08,
        scrollTrigger: { trigger: ".facts", start: "top 85%" },
      });
    },
    { scope: root },
  );

  const words = MANIFESTO.split(/(\*[^*]+\*)|\s+/).filter(Boolean);

  return (
    <section id="about" ref={root} className="about">
      <SectionLabel n="01">About</SectionLabel>
      <div className="about-grid">
        <p className="about-text">
          {words.map((w, i) =>
            w.startsWith("*") ? (
              <em className="word" key={i}>
                {w.slice(1, -1)}{" "}
              </em>
            ) : (
              <span className="word" key={i}>
                {w}{" "}
              </span>
            ),
          )}
        </p>
        <figure className="about-photo" data-cursor="HI!">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/me2.jpeg" alt="Krishnendu wearing a CURAA t-shirt at a startup event" />
          <figcaption>Wearing the merch, obviously.</figcaption>
        </figure>
      </div>

      <dl className="facts">
        {FACTS.map(([k, v]) => (
          <div className="fact" key={k}>
            <i className="fact-line" />
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
