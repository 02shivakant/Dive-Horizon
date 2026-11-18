"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { markPreloaderDone } from "@/lib/events";
import Logo from "./Logo";

const MIN_MS = 1000;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const state = { p: 0 };
      let dead = false;

      const render = () => {
        if (bar.current) gsap.set(bar.current, { scaleX: state.p / 100 });
        if (counter.current) counter.current.textContent = `${Math.round(state.p)}%`;
      };

      if (!reduce) gsap.to(state, { p: 90, duration: 1, ease: "power1.out", onUpdate: render });

      const loaded = new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      });
      const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
      const minTime = new Promise<void>((resolve) => setTimeout(resolve, reduce ? 150 : MIN_MS));

      Promise.all([loaded, fonts, minTime]).then(() => {
        if (dead) return;
        const tl = gsap.timeline({
          onComplete: () => {
            getLenis()?.start();
            markPreloaderDone();
            setGone(true);
          },
        });
        if (reduce) {
          tl.to(root.current, { autoAlpha: 0, duration: 0.3 });
        } else {
          tl.to(state, { p: 100, duration: 0.3, ease: "none", onUpdate: render })
            .to(content.current, { autoAlpha: 0, y: -16, duration: 0.3 }, "+=0.1")
            .to(root.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" });
        }
      });

      return () => {
        dead = true;
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-night"
      role="status"
      aria-live="polite"
      aria-label="Loading Dive Horizon"
    >
      <div ref={content} className="flex flex-col items-center gap-6">
        <Logo size="lg" />
        <div className="h-1 w-48 overflow-hidden rounded-full bg-cream/10">
          <div
            ref={bar}
            className="h-full origin-left rounded-full bg-sun"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <span ref={counter} className="font-heading text-xs tracking-widest text-lavender">
          0%
        </span>
      </div>
      {/* Curved bottom edge so the curtain wipes up with a soft hill shape */}
      <svg
        className="absolute left-0 top-full h-[8vw] w-full text-night"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0H100Q50 14 0 0Z" fill="currentColor" />
      </svg>
    </div>
  );
}
