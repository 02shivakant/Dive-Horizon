"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import SplitLetters from "@/components/ui/SplitLetters";

const PANELS = [
  {
    title: "Jump in fast",
    text: "One tap from the menu to your next run. No setup, no waiting.",
    src: "/media/screenshot-menu.jpg",
    alt: "Dive Horizon main menu with a big play button over a sunset hill scene",
  },
  {
    title: "Dive and launch",
    text: "Tap to dive down slopes. Hit a crest to launch into the sunset.",
    src: "/media/screenshot-gameplay.jpg",
    alt: "Dive Horizon gameplay: the orb gliding down a glowing slope",
  },
  {
    title: "Come back daily",
    text: "Seven days of bonus coins. Day 7 pays out 500.",
    src: "/media/screenshot-rewards.jpg",
    alt: "Dive Horizon daily rewards screen showing a seven day coin streak",
  },
  {
    title: "Climb the ranks",
    text: "Go farther every run and see where you land in the global ranking.",
    src: "/media/screenshot-rank.jpg",
    alt: "Dive Horizon global ranking screen with a leaderboard of players",
  },
];

export default function Screenshots() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 768px)" },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          if (!motion) return;

          const panels = q("[data-panel]");
          const track = q("[data-track]")[0] as HTMLElement;
          const bar = q("[data-bar]");
          let scrollTween: gsap.core.Tween | undefined;

          if (wide) {
            el.dataset.pinned = "true"; // switches the layout to a horizontal track (see classNames)
            const dist = () => Math.max(track.scrollWidth - window.innerWidth, 0);
            scrollTween = gsap.to(track, {
              x: () => -dist(),
              ease: "none",
              scrollTrigger: {
                trigger: el,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${dist()}`,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const i = Math.round(self.progress * (PANELS.length - 1)) + 1;
                  if (counter.current) counter.current.textContent = `0${i} / 0${PANELS.length}`;
                },
              },
            });
            gsap.to(bar, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
            });
          }

          panels.forEach((panel, i) => {
            const p = gsap.utils.selector(panel);
            const frame = p("[data-frame]");
            const dir = i % 2 === 0 ? 1 : -1;
            gsap.set(frame, { transformPerspective: 1000 });

            const st: ScrollTrigger.Vars = !wide
              ? { trigger: panel, start: "top 80%" }
              : i === 0
                ? { trigger: el, start: "top 60%" }
                : { trigger: panel, containerAnimation: scrollTween, start: "left 75%" };

            gsap
              .timeline({ scrollTrigger: { ...st, toggleActions: "play none none reverse" } })
              .from(p("[data-letter]"), { yPercent: 110, duration: 0.9, stagger: 0.04, ease: "expo.out" }, 0)
              .from(p("[data-text]"), { y: 20, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 0.4)
              .fromTo(
                frame,
                { rotateY: dir * 40, x: wide ? dir * 80 : 0, y: wide ? 0 : 40, autoAlpha: 0 },
                { rotateY: wide ? dir * -6 : 0, x: 0, y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" },
                0,
              );
          });

          return () => {
            delete el.dataset.pinned;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="screenshots"
      aria-label="Screenshots"
      className="group relative overflow-hidden bg-night group-data-[pinned=true]:h-screen data-[pinned=true]:h-screen"
    >
      <div
        data-track
        className="flex flex-col group-data-[pinned=true]:w-[400vw] group-data-[pinned=true]:flex-row data-[pinned=true]:w-[400vw]"
      >
        {PANELS.map((p, i) => (
          <article
            key={p.title}
            data-panel
            className="relative flex w-full flex-col items-center justify-center gap-10 px-6 py-20 md:flex-row md:justify-between md:gap-16 md:px-[8vw] group-data-[pinned=true]:h-screen group-data-[pinned=true]:w-screen group-data-[pinned=true]:shrink-0"
            style={{
              background: `radial-gradient(ellipse at ${i % 2 ? "30%" : "70%"} 50%, rgba(91,61,245,0.25), transparent 60%)`,
            }}
          >
            <div className={`max-w-xl text-center md:text-left ${i % 2 ? "md:order-2" : ""}`}>
              <p className="mb-3 font-heading text-sm font-bold tracking-widest text-gold">
                0{i + 1} / 0{PANELS.length}
              </p>
              <h3 className="font-heading font-extrabold text-cream">
                <span className="sr-only">{p.title}</span>
                <span aria-hidden="true" className="block text-[length:clamp(2.25rem,6vw,5rem)] leading-[1.05]">
                  {p.title.split(" ").map((w) => (
                    <span key={w} className="mr-[0.25em] inline-block">
                      <SplitLetters text={w} />
                    </span>
                  ))}
                </span>
              </h3>
              <p data-text className="mt-5 text-lg font-semibold text-cream/80 sm:text-xl">
                {p.text}
              </p>
            </div>

            <div
              data-frame
              className="w-[clamp(170px,min(60vw,40vh),300px)] shrink-0 overflow-hidden rounded-[2.2rem] border-[6px] border-ink bg-ink shadow-glow md:w-[clamp(180px,min(26vw,42vh),320px)]"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={540}
                height={1170}
                sizes="(min-width: 768px) 320px, 60vw"
                className="h-auto w-full rounded-[1.7rem]"
              />
            </div>
          </article>
        ))}
      </div>

      {/* Progress bar (pinned mode only) */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden w-[min(480px,70vw)] -translate-x-1/2 flex-col items-center gap-2 group-data-[pinned=true]:flex"
      >
        <span ref={counter} className="font-heading text-xs font-bold tracking-widest text-lavender">
          01 / 04
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
          <div data-bar className="h-full origin-left scale-x-0 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
