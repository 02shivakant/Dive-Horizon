"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Lightbox, { type MediaItem } from "@/components/ui/Lightbox";

type Tile = { item: MediaItem; className: string; label: string };

const TILES: Tile[] = [
  {
    label: "Gameplay clip",
    className: "md:col-span-7 aspect-video",
    item: {
      kind: "video",
      src: "/media/clip-1.mp4",
      webm: "/media/clip-1.webm",
      poster: "/media/clip-1-poster.jpg",
      alt: "Gameplay clip: the orb dives down a slope and launches off a crest",
      aspect: 16 / 9,
    },
  },
  {
    label: "Screenshot",
    className: "md:col-span-5 md:mt-24 aspect-[4/5]",
    item: {
      kind: "image",
      src: "/media/still-1.jpg",
      poster: "/media/still-1.jpg",
      alt: "Dive Horizon still: the orb mid-air above sunset hills",
      aspect: 4 / 5,
    },
  },
  {
    label: "Screenshot",
    className: "md:col-span-4 md:mt-4 aspect-[4/5]",
    item: {
      kind: "image",
      src: "/media/still-2.jpg",
      poster: "/media/still-2.jpg",
      alt: "Dive Horizon still: a trail of coins over a night sky",
      aspect: 4 / 5,
    },
  },
  {
    label: "Gameplay clip",
    className: "md:col-span-8 md:mt-16 aspect-video",
    item: {
      kind: "video",
      src: "/media/clip-2.mp4",
      webm: "/media/clip-2.webm",
      poster: "/media/clip-2-poster.jpg",
      alt: "Gameplay clip: a long run collecting coins under the stars",
      aspect: 16 / 9,
    },
  },
];

export default function GameplayStrip() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<{ item: MediaItem; origin: HTMLElement } | null>(null);

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

        q("[data-tile]").forEach((tile) => {
          // Clip-path reveal
          gsap.fromTo(
            tile,
            { clipPath: "inset(100% 0% 0% 0% round 1.5rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
              duration: 1.1,
              ease: "power3.inOut",
              scrollTrigger: { trigger: tile, start: "top 88%" },
            },
          );
          // Slight scroll parallax on the media inside the tile
          gsap.fromTo(
            tile.querySelector("[data-media]"),
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
          // Only play clips while they are on screen
          const v = tile.querySelector("video");
          if (v) {
            v.muted = true;
            v.pause();
            ScrollTrigger.create({
              trigger: tile,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => (self.isActive ? v.play().catch(() => {}) : v.pause()),
            });
          }
        });
      });

      // Reduced motion: no autoplay, clips show their poster
      mm.add("(prefers-reduced-motion: reduce)", () => {
        q("video").forEach((v) => (v as HTMLVideoElement).pause());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gameplay" className="relative overflow-hidden bg-night px-4 py-24 sm:px-6 sm:py-32">
      <div data-head className="mx-auto mb-14 max-w-3xl text-center">
        <h2 className="font-heading text-[length:clamp(2rem,6vw,4.5rem)] font-extrabold leading-tight">
          See it in motion
        </h2>
        <p className="mt-4 text-lg font-semibold text-cream/80">Tap any tile to view it larger.</p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 md:grid-cols-12 md:gap-8">
        {TILES.map(({ item, className, label }) => (
          <button
            key={item.src}
            data-tile
            type="button"
            aria-label={`View larger: ${item.alt}`}
            onClick={(e) => setActive({ item, origin: e.currentTarget })}
            className={`group relative w-full overflow-hidden rounded-3xl bg-ink text-left ${className}`}
          >
            <div data-media className="absolute -inset-y-[8%] inset-x-0">
              {item.kind === "video" ? (
                <video
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  poster={item.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  {item.webm && <source src={item.webm} type="video/webm" />}
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-night/70 px-3 py-1 text-xs font-bold backdrop-blur-sm">
              {label}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <Lightbox
          item={active.item}
          origin={active.origin}
          onClose={() => {
            active.origin.focus();
            setActive(null);
          }}
        />
      )}
    </section>
  );
}
