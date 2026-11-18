import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Smooth-scroll to a selector ("#trailer") or a pixel offset. Works with or without Lenis. */
export function scrollToTarget(target: string | number, offset = -80) {
  if (instance) {
    instance.scrollTo(target, {
      offset,
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  const y =
    typeof target === "number"
      ? target
      : el
        ? el.getBoundingClientRect().top + window.scrollY + offset
        : 0;
  window.scrollTo({ top: Math.max(y, 0), behavior: reduce ? "auto" : "smooth" });
}
