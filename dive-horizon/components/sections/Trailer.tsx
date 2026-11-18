"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import VideoPlayer from "@/components/ui/VideoPlayer";
import YouTubeFacade from "@/components/ui/YouTubeFacade";
import StoreBadges from "@/components/ui/StoreBadges";

type Props = {
  /** Fallback: used when the local trailer files are missing, or always when preferYouTube is true. */
  youtubeUrl?: string;
  preferYouTube?: boolean;
};

export default function Trailer({ youtubeUrl, preferYouTube = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);
  const useYouTube = Boolean(youtubeUrl) && (preferYouTube || failed);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q("[data-title]"), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-title]"), start: "top 85%" },
        });

        // Frame scales up and un-clips from a rounded mask while scrolling in
        gsap.fromTo(
          q("[data-frame]"),
          { scale: 0.82, clipPath: "inset(14% 14% round 3.5rem)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% round 2rem)",
            ease: "none",
            scrollTrigger: { trigger: q("[data-frame]"), start: "top 92%", end: "top 30%", scrub: true },
          },
        );

        gsap.from(q("[data-side]"), {
          autoAlpha: 0,
          x: (i: number) => (i === 0 ? -80 : 80),
          ease: "none",
          scrollTrigger: { trigger: q("[data-frame]"), start: "top 90%", end: "top 40%", scrub: true },
        });

        gsap.from(q("[data-badges]"), {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          scrollTrigger: { trigger: q("[data-badges]"), start: "top 95%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="trailer"
      className="relative overflow-hidden bg-night px-4 py-24 sm:px-6 sm:py-32"
      style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(91,61,245,0.22), transparent 60%), var(--night)" }}
    >
      <div data-title className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-heading text-[length:clamp(2rem,6vw,4.5rem)] font-extrabold leading-tight">
          Watch the trailer
        </h2>
        <p className="mt-4 text-lg font-semibold text-cream/80">
          See the dive, the launch and the sunset in 60 seconds.
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Orb silhouette (left) */}
        <div
          data-side
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full xl:block"
          style={{
            background: "radial-gradient(circle at 40% 35%, var(--dusk), var(--ink) 75%)",
            boxShadow: "0 0 80px 10px rgba(249,131,80,0.25)",
          }}
        />
        {/* Lighthouse silhouette (right) */}
        <svg
          data-side
          aria-hidden="true"
          viewBox="0 0 60 140"
          className="pointer-events-none absolute -right-24 bottom-0 hidden h-64 xl:block"
        >
          <path d="M18 138 L23 36 H37 L42 138Z" fill="#2e4543" />
          <rect x="19" y="30" width="22" height="7" rx="2" fill="#2e4543" />
          <rect x="23" y="14" width="14" height="16" rx="3" fill="#7a3b52" />
          <path d="M20 14 L30 2 L40 14Z" fill="#2e4543" />
        </svg>

        <div
          data-frame
          className="relative overflow-hidden rounded-[2rem] border border-cream/15 bg-ink"
          style={{ boxShadow: "0 0 120px 8px rgba(91,61,245,0.5), 0 0 0 6px rgba(91,61,245,0.15)" }}
        >
          {useYouTube && youtubeUrl ? (
            <YouTubeFacade url={youtubeUrl} />
          ) : (
            <VideoPlayer onError={() => setFailed(true)} />
          )}
        </div>
      </div>

      <div data-badges className="mt-12">
        <StoreBadges />
      </div>
    </section>
  );
}
