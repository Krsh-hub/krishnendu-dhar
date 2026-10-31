"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { profile } from "@/lib/content";
import { scrollToId } from "@/lib/motion";
import { Magnetic, Roll, SectionLabel } from "./ui";

function KolkataClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--:--"} IST</span>;
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Difference-blended nav turns cyan on orange; switch it to plain ink here
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 40px",
        end: "bottom top",
        onToggle: (self) => document.documentElement.classList.toggle("nav-ink", self.isActive),
      });

      gsap.utils.toArray<HTMLElement>(".cta-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { xPercent: i % 2 ? -30 : 30 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
          },
        );
      });
      gsap.from(".contact-mail, .contact-socials li", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".contact-mail", start: "top 90%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="contact" ref={root} className="contact">
      <SectionLabel n="05">Contact</SectionLabel>
      <h2 className="cta" aria-label="Let's build something loud">
        <span className="cta-line">Let&apos;s build</span>
        <span className="cta-line">
          <em>something</em> ✺
        </span>
        <span className="cta-line">loud.</span>
      </h2>

      <div className="contact-row">
        <Magnetic strength={0.2}>
          <a className="contact-mail" href={`mailto:${profile.email}`} data-cursor="SAY HI">
            {profile.email}
          </a>
        </Magnetic>
        <ul className="contact-socials">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                <Roll text={s.label} /> ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer">
        <span>
          Kolkata — <KolkataClock />
        </span>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <button onClick={() => scrollToId("top")} data-cursor="UP">
          <Roll text="Back to top ↑" />
        </button>
      </footer>
    </section>
  );
}
