import type Lenis from "lenis";

// Shared Lenis instance (set by <SmoothScroll />)
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};

// Intro signal: fired once the preloader curtain starts lifting
let introDone = false;
const subs = new Set<() => void>();
export const onIntroDone = (cb: () => void) => {
  if (introDone) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
};
export const markIntroDone = () => {
  introDone = true;
  subs.forEach((cb) => cb());
  subs.clear();
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
