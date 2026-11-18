"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NAV_LINKS, SITE } from "@/lib/site";
import { scrollToTarget } from "@/lib/lenis";
import { onPreloaderDone } from "@/lib/events";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { PlayIcon } from "@/components/ui/icons";

export default function Navbar() {
  const pill = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = pill.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(el, { autoAlpha: 0, y: reduce ? 0 : -24 });
      const off = onPreloaderDone(() => {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.8, ease: "power3.out" });
      });

      ScrollTrigger.create({
        start: 48,
        end: "max",
        onToggle: (self) => {
          el.dataset.scrolled = String(self.isActive);
        },
      });

      return off;
    },
    { scope: pill },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, target: string | number) => {
    e.preventDefault();
    scrollToTarget(target);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        ref={pill}
        aria-label="Main"
        data-scrolled="false"
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-cream/10 bg-night/40 py-2 pl-5 pr-2 backdrop-blur-md transition-[background-color,box-shadow] duration-300 data-[scrolled=true]:bg-night/80 data-[scrolled=true]:shadow-glow md:gap-6"
      >
        <a href="#top" onClick={(e) => go(e, 0)} aria-label="Dive Horizon, back to top">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="rounded-full px-3 py-2 text-sm font-semibold text-cream/80 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <Button
          href={SITE.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play (opens in a new tab)"
        >
          <PlayIcon />
          <span className="hidden sm:inline">Get it on Google Play</span>
          <span className="sm:hidden">Google Play</span>
        </Button>
      </nav>
    </header>
  );
}
