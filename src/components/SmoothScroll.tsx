"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onIntroDone, prefersReducedMotion, setLenis } from "@/lib/motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.stop(); // locked until the preloader finishes
    const off = onIntroDone(() => lenis.start());

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      off();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
