"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { archive } from "@/lib/content";
import { scramble, SectionLabel } from "./ui";

export default function Archive() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      gsap.from(".arc-row", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".arc-list", start: "top 85%" },
      });
      gsap.from(".arc-head .big > span", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".arc-head", start: "top 80%" },
      });
    },
    { scope: root },
  );

  // Floating preview follows the cursor
  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX + 48);
      yTo(e.clientY - 40);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    gsap.to(preview.current, {
      scale: active === null ? 0 : 1,
      rotate: active === null ? -8 : 0,
      duration: 0.5,
      ease: active === null ? "power3.in" : "back.out(2)",
    });
  }, [active]);

  const enter = (i: number, e: React.PointerEvent<HTMLElement>) => {
    setActive(i);
    const item = archive[i];
    if (item.secret) {
      const title = e.currentTarget.querySelector<HTMLElement>(".arc-title");
      if (title) scramble(title, "CLASSIFIED", 0.6).then(() => scramble(title, item.title, 0.6));
    }
  };

  const item = active !== null ? archive[active] : null;

  return (
    <section ref={root} className="archive">
      <div className="arc-head">
        <SectionLabel n="03">The archive</SectionLabel>
        <h2 className="big">
          <span>More from</span> <span>
            the <em>lab</em>
          </span>
        </h2>
      </div>

      <ul className="arc-list" onPointerLeave={() => setActive(null)}>
        {archive.map((a, i) => {
          const Tag = a.href ? "a" : "div";
          return (
            <li key={a.title} className={`arc-row${active === i ? " is-active" : ""}${a.secret ? " is-secret" : ""}`}>
              <Tag
                {...(a.href ? { href: a.href, target: "_blank", rel: "noreferrer" } : {})}
                className="arc-link"
                onPointerEnter={(e: React.PointerEvent<HTMLElement>) => enter(i, e)}
              >
                <span className="arc-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="arc-title">{a.title}</span>
                <span className="arc-kind">{a.kind}</span>
                <span className="arc-stack">{a.stack}</span>
                <span className="arc-year">{a.year}</span>
                <span className="arc-note">{a.note}</span>
              </Tag>
            </li>
          );
        })}
      </ul>

      <div ref={preview} className="arc-preview" aria-hidden>
        {item && (
          <>
            <b>{item.kind}</b>
            <p>{item.note}</p>
            <span>{item.secret ? "Access denied" : item.href ? "Click to open ↗" : ""}</span>
          </>
        )}
      </div>
    </section>
  );
}
