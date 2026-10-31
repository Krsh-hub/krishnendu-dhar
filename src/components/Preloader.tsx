"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone, prefersReducedMotion } from "@/lib/motion";

const WORDS = ["ideas", "products", "agents", "startups", "collars", "chaos", "things"];

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const counter = { v: 0 };
      let lastWord = -1;
      const tl = gsap.timeline({ onComplete: () => setGone(true) });

      tl.from(".pl-line > *", { yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.06 })
        .to(
          counter,
          {
            v: 100,
            duration: reduced ? 0.4 : 2.2,
            ease: "power3.inOut",
            onUpdate: () => {
              const v = Math.round(counter.v);
              if (num.current) num.current.textContent = String(v).padStart(3, "0");
              const w = Math.min(WORDS.length - 1, Math.floor((v / 100) * WORDS.length));
              if (w !== lastWord && word.current) {
                lastWord = w;
                word.current.textContent = WORDS[w];
              }
            },
          },
          "<0.2",
        )
        .to(".pl-line > *", { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 })
        .add(markIntroDone, "-=0.05")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "<");
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="pl-top">
        <div className="pl-line">
          <span>Krishnendu Dhar</span>
        </div>
        <div className="pl-line">
          <span>Portfolio ©{new Date().getFullYear()}</span>
        </div>
      </div>
      <div className="pl-mid pl-line">
        <span>
          building <em ref={word}>ideas</em>
        </span>
      </div>
      <div className="pl-num pl-line">
        <span ref={num}>000</span>
      </div>
    </div>
  );
}
