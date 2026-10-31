"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/motion";
import { profile } from "@/lib/content";

const HeroBlob = dynamic(() => import("./HeroBlob"), { ssr: false });

const chars = (s: string) =>
  [...s].map((c, i) => (
    <span className="char" key={i}>
      <span>{c}</span>
    </span>
  ));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [phrase, setPhrase] = useState(0);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      // Explicit selector: the intro callback fires inside the preloader's GSAP context,
      // so bare selector strings would resolve against the wrong scope.
      const q = gsap.utils.selector(root);
      gsap.set(q(".hero-name .char > span"), { yPercent: 115, rotate: 8 });
      const off = onIntroDone(() => {
        setReady(true);
        gsap
          .timeline({ delay: 0.25 })
          .to(q(".hero-name .char > span"), {
            yPercent: 0,
            rotate: 0,
            duration: 1.4,
            ease: "expo.out",
            stagger: { each: 0.045, from: "start" },
          })
          .from(q(".hero-meta > *"), { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.4)
          .from(q(".hero-scroll"), { opacity: 0, duration: 1 }, 0.9);
      });

      // Scroll: letters drift apart at different speeds as the hero leaves
      gsap.utils.toArray<HTMLElement>(".hero-name .char").forEach((c, i) => {
        gsap.to(c, {
          y: () => -(80 + ((i * 137) % 260)),
          rotate: ((i * 53) % 30) - 15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
      gsap.to(".hero-sub", {
        xPercent: 12,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
      });
      return off;
    },
    { scope: root },
  );

  // Rotating tagline
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => setPhrase((p) => (p + 1) % profile.phrases.length), 2800);
    return () => clearInterval(id);
  }, [ready]);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(
        ".hero-phrase .w",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.05 },
      );
    },
    { scope: root, dependencies: [phrase, ready] },
  );

  return (
    <section id="top" ref={root} className="hero">
      <div className="hero-canvas">
        <HeroBlob />
      </div>

      <div className="hero-meta">
        <span>(Portfolio ©{new Date().getFullYear()})</span>
        <span>
          {profile.role}
          <br />
          Currently @ CURAA
        </span>
        <span>
          {profile.location}
          <br />
          22.57° N, 88.36° E
        </span>
      </div>

      <div className="hero-bottom">
        <h1 className="hero-name" aria-label={profile.name}>
          <span className="hero-line">{chars(profile.first)}</span>
          <span className="hero-line hero-line-2">
            {chars(profile.last)}
            <span className="hero-sub">
              <span className="hero-phrase" key={phrase} aria-live="polite">
                {profile.phrases[phrase].split(" ").map((w, i) => (
                  <span className="w-wrap" key={i}>
                    <span className="w">{w}&nbsp;</span>
                  </span>
                ))}
              </span>
            </span>
          </span>
        </h1>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
