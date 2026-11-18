"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const STREAK = [50, 100, 150, 200, 250, 300, 500];
const MAX = Math.max(...STREAK);
const TOTAL = STREAK.reduce((a, b) => a + b, 0);
const fmt = (n: number) => n.toLocaleString("en-US");

type Feature = {
  title: string;
  text: string;
  count?: number;
  unit?: string;
  label?: string;
};

const FEATURES: Feature[] = [
  { title: "One-tap controls", text: "One finger is all you need to dive and launch.", count: 1, unit: "tap" },
  {
    title: "Daily rewards",
    text: "Log in each day to build a seven-day streak and earn bonus coins.",
    count: TOTAL,
    unit: "coins per 7-day streak",
  },
  { title: "Global ranking", text: "See how far you go compared with players everywhere.", label: "Worldwide" },
  { title: "No ads option", text: "Prefer to play uninterrupted? Choose the no-ads option.", label: "Your choice" },
];

export default function Rewards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("[data-head]"), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-head]"), start: "top 85%" },
        });

        // Streak: bars grow up in a stagger, then day 7 pulses gold
        const pulse = gsap.fromTo(
          q("[data-pulse]"),
          { boxShadow: "0 0 0 0 rgba(255,201,74,0)" },
          { boxShadow: "0 0 44px 8px rgba(255,201,74,0.6)", duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut", paused: true },
        );
        gsap
          .timeline({
            scrollTrigger: { trigger: q("[data-streak]"), start: "top 80%", once: true },
          })
          .from(q("[data-bar]"), { scaleY: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" })
          .from(q("[data-day]"), { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.12 }, 0.1)
          .add(() => {
            pulse.play();
          });

        // Feature rows: reveal + count-up
        q("[data-row]").forEach((row) => {
          const el = row.querySelector<HTMLElement>("[data-count]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } });
          tl.from(row, { y: 30, autoAlpha: 0, duration: 0.8, ease: "power3.out" });
          if (el) {
            const end = Number(el.dataset.count);
            const o = { v: 0 };
            el.textContent = "0";
            tl.to(
              o,
              {
                v: end,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = fmt(Math.round(o.v));
                },
              },
              0.2,
            );
          }
        });

        return () => {
          q("[data-count]").forEach((el) => {
            (el as HTMLElement).textContent = fmt(Number((el as HTMLElement).dataset.count));
          });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="rewards"
      className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32"
      style={{ background: "linear-gradient(to bottom, var(--night), #1d1730 60%, var(--night))" }}
    >
      <div data-head className="mx-auto mb-14 max-w-3xl text-center">
        <h2 className="font-heading text-[length:clamp(2rem,6vw,4.5rem)] font-extrabold leading-tight">
          Come back daily, earn more
        </h2>
        <p className="mt-4 text-lg font-semibold text-cream/80">
          Keep your streak alive for seven days. Day 7 pays {fmt(MAX)} bonus coins.
        </p>
      </div>

      <ol data-streak aria-label="Seven day reward streak" className="mx-auto grid max-w-5xl grid-cols-7 gap-2 sm:gap-4">
        {STREAK.map((coins, i) => {
          const last = i === STREAK.length - 1;
          return (
            <li key={coins} aria-label={`Day ${i + 1}: ${coins} bonus coins`} className="flex flex-col items-center gap-2">
              <div
                data-pulse={last ? "" : undefined}
                aria-hidden="true"
                className={`flex h-56 w-full items-end overflow-hidden rounded-xl p-1 sm:h-72 sm:rounded-2xl sm:p-1.5 ${
                  last ? "border-2 border-gold bg-gold/10" : "border border-cream/10 bg-cream/5"
                }`}
              >
                <div
                  data-bar
                  className={`w-full origin-bottom rounded-lg sm:rounded-xl ${
                    last ? "bg-gradient-to-t from-sun to-gold" : "bg-gradient-to-t from-dusk to-sun"
                  }`}
                  style={{ height: `${(coins / MAX) * 100}%` }}
                />
              </div>
              <div data-day aria-hidden="true" className="text-center">
                <div className={`font-heading text-xs font-bold sm:text-lg ${last ? "text-gold" : "text-cream"}`}>
                  {coins}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-lavender sm:text-xs">
                  Day {i + 1}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <ul className="mx-auto mt-24 max-w-5xl divide-y divide-cream/15 border-y border-cream/15">
        {FEATURES.map((f, i) => (
          <li
            key={f.title}
            data-row
            className="grid items-center gap-4 py-8 md:grid-cols-[auto_1fr_auto] md:gap-10 md:py-10"
          >
            <span className="font-heading text-sm font-bold tracking-widest text-gold">0{i + 1}</span>
            <div>
              <h3 className="font-heading text-2xl font-bold sm:text-3xl">{f.title}</h3>
              <p className="mt-2 max-w-xl text-lg font-semibold text-cream/75">{f.text}</p>
            </div>
            <div className="md:text-right">
              {f.count !== undefined ? (
                <>
                  <span data-count={f.count} className="font-heading text-4xl font-extrabold text-gold sm:text-5xl">
                    {fmt(f.count)}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-lavender">{f.unit}</span>
                </>
              ) : (
                <span className="font-heading text-xl font-bold text-lavender sm:text-2xl">{f.label}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
