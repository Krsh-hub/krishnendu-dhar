"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onIntroDone, scrollToId } from "@/lib/motion";
import { Roll } from "./ui";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "play", label: "Play" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(
    () =>
      onIntroDone(() => {
        gsap.fromTo(
          ref.current!.querySelectorAll(".nav-item"),
          { yPercent: -120 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.5 },
        );
      }),
    [],
  );

  return (
    <header ref={ref} className="nav">
      <button className="nav-item nav-logo" onClick={() => scrollToId("top")} data-cursor="TOP">
        KD<sup>®</sup>
      </button>
      <span className="nav-item nav-status">
        <i /> Open to collabs
      </span>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <button key={l.id} className="nav-item" onClick={() => scrollToId(l.id)}>
            <Roll text={l.label} />
          </button>
        ))}
      </nav>
    </header>
  );
}
