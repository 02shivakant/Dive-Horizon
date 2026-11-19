"use client";

import { useRef } from "react";
import PhoneLandscape from "@/components/ui/PhoneLandscape";
import { gsap, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/events";
import { scrollToTarget } from "@/lib/lenis";
import { SITE } from "@/lib/site";
import Button from "@/components/ui/Button";
import SplitLetters from "@/components/ui/SplitLetters";
import { PlayIcon } from "@/components/ui/icons";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
          if (!motion) return; // reduced motion: everything stays in its final, visible state

          const layers = q("[data-layer]");
          const letters = q("[data-letter]");
          const orbWrap = q("[data-orbwrap]");
          const orb = q("[data-orb]");
          const tag = q("[data-tag]");
          const copy = q("[data-copy]");
          const ctas = q("[data-cta]");
          const phone = q("[data-phone]");
          const parallax = q("[data-parallax]");
          const float = q("[data-float]");
          const fade = q("[data-fade]");
          const cue = q("[data-cue]");
          const beam = q("[data-beam]");

          // 1) Entrance (starts after the preloader curtain)
          const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
          tl.from(layers, { y: 90, autoAlpha: 0, duration: 1.2, stagger: 0.12 }, 0)
            .from(orb, { y: "-70vh", autoAlpha: 0, duration: 1.8, ease: "bounce.out" }, 0.3)
            .from(tag, { y: 16, autoAlpha: 0, duration: 0.7 }, 0.5)
            .from(letters, { yPercent: 110, duration: 1.1, stagger: 0.06, ease: "expo.out" }, 0.6)
            .from(copy, { y: 20, autoAlpha: 0, duration: 0.8 }, 1.1)
            .from(ctas, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 1.25)
            .from(phone, { y: 70, autoAlpha: 0, duration: 1.1 }, 1)
            .from(cue, { autoAlpha: 0, duration: 0.8 }, 1.6);
          const offPre = onPreloaderDone(() => tl.play());

          // 2) Ambient loops: lighthouse beam pulse + phone float + cue bob
          gsap.fromTo(
            beam,
            { opacity: 0.3, scaleX: 0.92 },
            { opacity: 0.85, scaleX: 1.05, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" },
          );
          gsap.to(float, { y: -14, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
          gsap.to(q("[data-dot]"), { y: 14, duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut" });

          // 3) Mouse-move parallax on the phone (desktop pointers only)
          let offMouse = () => {};
          if (fine) {
            gsap.set(parallax, { transformPerspective: 900 });
            const xTo = gsap.quickTo(parallax, "x", { duration: 0.7, ease: "power3" });
            const yTo = gsap.quickTo(parallax, "y", { duration: 0.7, ease: "power3" });
            const ryTo = gsap.quickTo(parallax, "rotationY", { duration: 0.7, ease: "power3" });
            const rxTo = gsap.quickTo(parallax, "rotationX", { duration: 0.7, ease: "power3" });
            const onMove = (e: MouseEvent) => {
              const nx = e.clientX / window.innerWidth - 0.5;
              const ny = e.clientY / window.innerHeight - 0.5;
              xTo(nx * 36);
              yTo(ny * 24);
              ryTo(nx * 10);
              rxTo(-ny * 8);
            };
            window.addEventListener("mousemove", onMove);
            offMouse = () => window.removeEventListener("mousemove", onMove);
          }

          // 4) Scroll out: content fades, hills drift down at different speeds
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
            })
            .to([...fade, ...cue], { autoAlpha: 0, y: -80 }, 0)
            .to(layers, { yPercent: (i: number) => [12, 28, 50][i] ?? 30 }, 0)
            .to(orbWrap, { yPercent: 40 }, 0);

          return () => {
            offPre();
            offMouse();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] overflow-hidden bg-night">
      {/* Sky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--night) 0%, var(--violet) 30%, var(--dusk) 60%, var(--sun) 86%, var(--gold) 100%)",
        }}
      />

      {/* Orb (the sun) */}
      <div
        data-orbwrap
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[30%] z-[1] flex justify-center lg:justify-start lg:pl-[46%]"
      >
        <div
          data-orb
          className="h-[clamp(96px,15vw,190px)] w-[clamp(96px,15vw,190px)] rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 35%, var(--gold), var(--sun) 70%)",
            boxShadow: "0 0 90px 20px rgba(249,131,80,0.55)",
          }}
        />
      </div>

      {/* Hills (back, mid with lighthouse, front) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div data-layer className="absolute inset-x-0 bottom-0 z-[2] h-[46vh]">
          <svg className="h-full w-full text-dusk" viewBox="0 0 1440 400" preserveAspectRatio="none">
            <path
              fill="currentColor"
              d="M0 140C180 60 340 70 520 130C700 190 860 90 1060 80C1240 72 1360 120 1440 150V400H0Z"
            />
          </svg>
        </div>

        <div data-layer className="absolute inset-x-0 bottom-0 z-[3] h-[38vh]">
          <svg className="h-full w-full text-ridge" viewBox="0 0 1440 400" preserveAspectRatio="none">
            <path
              fill="currentColor"
              d="M0 180C120 120 220 110 330 150C520 220 700 120 900 140C1120 165 1280 110 1440 150V400H0Z"
            />
          </svg>
          {/* Lighthouse */}
          <div className="absolute bottom-[64%] left-[6%] h-[clamp(120px,24vh,230px)] aspect-[60/140]">
            <svg className="h-full w-full" viewBox="0 0 60 140">
              <path d="M18 138 L23 36 H37 L42 138Z" fill="#fff1dc" />
              <path d="M20.5 84 L21.6 56 H38.4 L39.5 84Z" fill="#7a3b52" />
              <rect x="19" y="30" width="22" height="7" rx="2" fill="#2e4543" />
              <rect x="23" y="14" width="14" height="16" rx="3" fill="#ffc94a" />
              <path d="M20 14 L30 2 L40 14Z" fill="#7a3b52" />
            </svg>
            <div
              data-beam
              className="absolute left-1/2 top-[15%] -mt-[45px] h-[90px] w-[70vw] origin-left opacity-50"
              style={{
                background: "linear-gradient(to right, rgba(255,201,74,0.85), rgba(255,201,74,0))",
                clipPath: "polygon(0 46%, 100% 0, 100% 100%, 0 54%)",
              }}
            />
          </div>
        </div>

        <div data-layer className="absolute inset-x-0 bottom-0 z-[4] h-[26vh]">
          <svg className="h-full w-full text-night" viewBox="0 0 1440 400" preserveAspectRatio="none">
            <path
              fill="currentColor"
              d="M0 120C240 190 480 200 720 150C960 100 1200 90 1440 160V400H0Z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div
        data-fade
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pb-24 pt-28 text-center lg:items-start lg:pb-32 lg:pt-28 lg:text-left"
      >
        <p
          data-tag
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/20 bg-night/30 px-4 py-1.5 text-sm font-bold backdrop-blur-sm"
        >
          <span className="h-2 w-2 " aria-hidden="true" />
          Free on Android
        </p>

        <h1 className="font-heading font-extrabold uppercase text-cream">
          <span className="sr-only">Dive Horizon</span>
          <span
            aria-hidden="true"
            className="block text-[length:clamp(4.5rem,20vw,16rem)] leading-[0.9] lg:text-[length:clamp(7rem,13vw,13rem)]"
          >
            <SplitLetters text="DIVE" />
          </span>
          <span
            aria-hidden="true"
            className="mt-3 block text-[length:clamp(1.25rem,6vw,3rem)] tracking-[0.35em] text-gold lg:text-[length:clamp(1.5rem,3.2vw,3.2rem)]"
          >
            <SplitLetters text="HORIZON" />
          </span>
        </h1>

        <p data-copy className="mt-6 max-w-md text-lg font-semibold text-cream/85">
          Tap to dive. Ride the slopes. Launch off the crests and chase the sunset.
        </p>

        <div className="relative z-20 mt-8 flex translate-y-10 flex-wrap items-center justify-center gap-3 lg:translate-y-0 lg:justify-start">
          <div data-cta>
            <Button
              href={SITE.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 text-base"
            >
              <PlayIcon />
              Play free on Android
            </Button>
          </div>
          <div data-cta>
            <Button
              variant="ghost"
              href="#trailer"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#trailer");
              }}
              className="px-7 py-3.5 text-base"
            >
              Watch trailer
            </Button>
          </div>
        </div>

                {/* Floating phone card (desktop) */}
        <div
          data-phone
          className="absolute right-[-3%] top-[24vh] hidden w-[clamp(300px,min(34vw,95vh),560px)] lg:block"
        >
          <div data-parallax>
            <div data-float>
              <PhoneLandscape
                src="/media/screenshot-gameplay.jpg"
                alt="Dive Horizon gameplay: the orb gliding down a glowing slope at sunset"
                sizes="560px"
                priority
                className="-rotate-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        data-cue
        type="button"
        onClick={() => scrollToTarget(window.innerHeight, 0)}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-sm font-bold text-cream/90"
      >
        Scroll to dive
        <span className="relative block h-9 w-px bg-cream/40" aria-hidden="true">
          <span data-dot className="absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-gold" />
        </span>
      </button>
    </section>
  );
}
