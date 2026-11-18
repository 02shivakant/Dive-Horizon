"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* ---------- Scene data ---------- */
// World is 1700 x 900 SVG units. The orb runs along RUN_D; the ground is drawn around it.
const REST =
  "C150 300 250 330 400 480 C500 580 560 600 660 520 C760 440 820 330 940 360 C1060 390 1120 560 1260 640 C1360 700 1440 640 1500 560 C1550 500 1600 470 1660 460";
const RUN_D = `M60 300 ${REST}`;
const EDGE_D = `M-200 300 H60 ${REST} H2400`;
const GROUND_D = `${EDGE_D} V900 H-200Z`;
const FAR_D = "M-300 520C100 430 300 440 520 500S900 560 1200 470S1700 430 2100 520V900H-300Z";

const WORLD_W = 1700;
const WORLD_H = 900;
const ORB_R = 22;
const HOP = 110; // launch height off the crest
const MAX_M = 320;
const TOAST_M = 100;
const COIN_COUNT = 11;
const CAPTIONS = ["Tap to dive.", "Slopes are speed. Crests are launch pads.", "Go farther every run."];
const CAP_START = [0.02, 0.36, 0.7];
const CAP_END = [0.3, 0.64, 1];

// Deterministic stars (no Math.random, so server and client markup match)
const STARS = (() => {
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 70 }, () => ({
    x: rnd() * 100,
    y: rnd() * 60,
    r: 1 + rnd() * 2,
    o: 0.4 + rnd() * 0.6,
  }));
})();

export default function DiveScene() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const run = useRef<SVGPathElement>(null);
  const orbG = useRef<SVGGElement>(null);
  const rollG = useRef<SVGGElement>(null);
  const farG = useRef<SVGGElement>(null);
  const edge = useRef<SVGPathElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const stars = useRef<HTMLDivElement>(null);
  const distEl = useRef<HTMLSpanElement>(null);
  const coinEl = useRef<HTMLSpanElement>(null);
  const toastEl = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const svgEl = svg.current;
      const path = run.current;
      const orb = orbG.current;
      const roll = rollG.current;
      const far = farG.current;
      if (!el || !svgEl || !path || !orb || !roll || !far) return;

      const q = gsap.utils.selector(root);
      const coins = q("[data-coin]");
      const caps = q("[data-cap]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => build(true));
      mm.add("(prefers-reduced-motion: reduce)", () => build(false));

      function build(motion: boolean) {
        const L = path!.getTotalLength();

        // Crest = highest point between x 600 and 1100 (the launch pad)
        let tc = 0.5;
        let minY = Infinity;
        for (let i = 0; i <= 600; i++) {
          const pt = path!.getPointAtLength((L * i) / 600);
          if (pt.x > 600 && pt.x < 1100 && pt.y < minY) {
            minY = pt.y;
            tc = i / 600;
          }
        }
        const coinT = [0.08, 0.12, 0.16, 0.22, tc + 0.015, tc + 0.035, tc + 0.055, 0.78, 0.82, 0.86, 0.92];

        // Position along the path, lifted along the surface normal, plus the hop after the crest
        const pose = (p: number, lift: number) => {
          const d = gsap.utils.clamp(0, 1, p) * L;
          const a = path!.getPointAtLength(Math.max(0, d - 2));
          const b = path!.getPointAtLength(Math.min(L, d + 2));
          const c = path!.getPointAtLength(d);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const m = Math.hypot(dx, dy) || 1;
          const hop = HOP * Math.sin(Math.PI * gsap.utils.clamp(0, 1, (p - tc) / 0.08));
          return { x: c.x + (dy / m) * lift, y: c.y + (-dx / m) * lift - hop };
        };

        coins.forEach((c, i) => {
          const pos = pose(coinT[i], 30);
          gsap.set(c, { x: pos.x, y: pos.y, opacity: 1, scale: 1, transformOrigin: "50% 50%" });
        });

        const got = coins.map(() => false);
        let toastShown = false;
        const toast = motion
          ? gsap
              .timeline({ paused: true })
              .fromTo(
                toastEl.current,
                { autoAlpha: 0, y: 24, scale: 0.8 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" },
              )
              .to(toastEl.current, { autoAlpha: 0, y: -16, duration: 0.4 }, "+=1.4")
          : null;

        const state = { p: 0 };

        const render = (p: number) => {
          const o = pose(p, ORB_R);
          orb!.setAttribute("transform", `translate(${o.x} ${o.y})`);
          roll!.setAttribute("transform", `rotate(${((p * L) / ORB_R) * 57.3})`);

          // Camera: always fill the height, pan sideways when the screen is narrow
          const vw = Math.min(WORLD_H * (el!.clientWidth / el!.clientHeight), WORLD_W);
          const cx = gsap.utils.clamp(0, WORLD_W - vw, o.x - vw * 0.35);
          svgEl!.setAttribute("viewBox", `${cx} 0 ${vw} ${WORLD_H}`);
          gsap.set(far, { x: cx * 0.7 });

          let n = 0;
          coins.forEach((c, i) => {
            const hit = p >= coinT[i];
            if (hit) n++;
            if (hit === got[i]) return;
            got[i] = hit;
            if (!motion) gsap.set(c, { opacity: hit ? 0 : 1, scale: 1 });
            else if (hit) gsap.to(c, { scale: 1.9, opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
            else gsap.to(c, { scale: 1, opacity: 1, duration: 0.2, overwrite: true });
          });

          if (distEl.current) distEl.current.textContent = String(Math.round(p * MAX_M));
          if (coinEl.current) coinEl.current.textContent = String(n);

          const past = p * MAX_M >= TOAST_M;
          if (toast) {
            if (past && !toastShown) toast.restart();
            else if (!past && toastShown) toast.pause(0);
          }
          toastShown = past;
        };

        if (!motion) {
          // Reduced motion: no pin, a calm static frame with all captions listed
          el!.dataset.static = "true";
          gsap.set(night.current, { opacity: 0.85 });
          gsap.set(stars.current, { opacity: 1 });
          gsap.set(caps, { opacity: 1, y: 0 });
          render(0.5);
          return () => {
            delete el!.dataset.static;
          };
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${window.innerHeight * 4}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => render(state.p),
          },
        });

        tl.to(state, { p: 1, duration: 1, onUpdate: () => render(state.p) }, 0)
          .to(night.current, { opacity: 1, duration: 0.85 }, 0)
          .to(stars.current, { opacity: 1, duration: 0.5 }, 0.35)
          .to(edge.current, { stroke: "#9db0ff", duration: 0.6 }, 0.2);

        caps.forEach((cap, i) => {
          tl.fromTo(cap, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06 }, CAP_START[i]);
          if (i < caps.length - 1) tl.to(cap, { opacity: 0, y: -30, duration: 0.06 }, CAP_END[i] - 0.06);
        });

        render(0);
      }

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="How Dive Horizon plays"
      className="group relative h-[100svh] overflow-hidden bg-night group-data-[static=true]:h-[100svh]"
    >
      {/* Sky: sunset, with a night layer fading in on top */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--night) 0%, var(--violet) 28%, var(--dusk) 58%, var(--sun) 88%, var(--gold) 100%)",
        }}
      />
      <div
        ref={night}
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
        style={{ background: "linear-gradient(to bottom, #07090d 0%, var(--night) 55%, #231a3d 100%)" }}
      />
      <div ref={stars} aria-hidden="true" className="absolute inset-0 opacity-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-cream"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, opacity: s.o }}
          />
        ))}
      </div>

      {/* World */}
      <svg
        ref={svg}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="dive-ground" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="900">
            <stop offset="0" stopColor="#2e4543" />
            <stop offset="1" stopColor="#15191e" />
          </linearGradient>
          <radialGradient id="dive-orb" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#ffc94a" />
            <stop offset="1" stopColor="#f98350" />
          </radialGradient>
        </defs>

        <g ref={farG}>
          <path d={FAR_D} fill="#7a3b52" opacity="0.7" />
        </g>
        <path d={GROUND_D} fill="url(#dive-ground)" />
        <path d={EDGE_D} fill="none" stroke="#f98350" strokeWidth="14" opacity="0.25" strokeLinecap="round" />
        <path ref={edge} d={EDGE_D} fill="none" stroke="#f98350" strokeWidth="4" strokeLinecap="round" />
        <path ref={run} d={RUN_D} fill="none" stroke="none" />

        {Array.from({ length: COIN_COUNT }, (_, i) => (
          <g key={i} data-coin style={{ opacity: 0 }}>
            <circle r="13" fill="#ffc94a" />
            <circle r="8" fill="none" stroke="#f98350" strokeWidth="2.5" />
          </g>
        ))}

        <g ref={orbG} transform="translate(60 300)">
          <circle r="36" fill="#f98350" opacity="0.28" />
          <circle r={ORB_R} fill="url(#dive-orb)" />
          <g ref={rollG}>
            <circle cx="10" cy="-9" r="5" fill="#fff1dc" opacity="0.85" />
          </g>
        </g>
      </svg>

      {/* HUD */}
      <div aria-hidden="true" className="pointer-events-none absolute left-4 top-24 z-10 flex gap-2 sm:left-8">
        <div className="rounded-2xl border border-cream/15 bg-night/50 px-4 py-2 backdrop-blur-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-lavender">Distance</div>
          <div className="font-heading text-xl text-cream">
            <span ref={distEl}>0</span> m
          </div>
        </div>
        <div className="rounded-2xl border border-cream/15 bg-night/50 px-4 py-2 backdrop-blur-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-lavender">Coins</div>
          <div className="flex items-center gap-2 font-heading text-xl text-gold">
            <span className="h-4 w-4 rounded-full border-2 border-sun bg-gold" />
            <span ref={coinEl}>0</span>
          </div>
        </div>
      </div>

      {/* Milestone toast */}
      <div
        ref={toastEl}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-1/2 top-[30%] z-10 -translate-x-1/2 rounded-full bg-gold px-6 py-3 font-heading text-base font-bold text-ink opacity-0 shadow-glow-gold sm:text-xl"
      >
        100m Reached!
      </div>

      {/* Captions */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10vh] z-10 grid gap-3 px-6 text-center group-data-[static=true]:flex group-data-[static=true]:flex-col">
        {CAPTIONS.map((c) => (
          <p
            key={c}
            data-cap
            className="col-start-1 row-start-1 mx-auto max-w-2xl font-heading text-xl font-bold text-cream opacity-0 [text-shadow:0_2px_24px_rgba(21,25,30,0.8)] sm:text-4xl"
          >
            {c}
          </p>
        ))}
      </div>
    </section>
  );
}
