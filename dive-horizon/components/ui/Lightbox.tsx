"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

export type MediaItem = {
  kind: "video" | "image";
  src: string; // image src, or mp4 src for video
  webm?: string;
  poster: string;
  alt: string;
  aspect: number; // width / height
};

type Props = { item: MediaItem; origin: HTMLElement; onClose: () => void };

export default function Lightbox({ item, origin, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const reduce = useRef(false);

  // Open: the frame starts fitted onto the clicked tile (Flip.fit), then animates to its place
  useGSAP(
    () => {
      reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.fromTo(back.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce.current ? 0.01 : 0.4 });
      if (reduce.current) return;
      Flip.fit(frame.current!, origin, { scale: true });
      gsap.to(frame.current, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.7, ease: "power3.inOut" });
    },
    { scope: dialog },
  );

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (reduce.current) return onClose();
    gsap.to(back.current, { autoAlpha: 0, duration: 0.45 });
    Flip.fit(frame.current!, origin, { scale: true, duration: 0.6, ease: "power3.inOut", onComplete: onClose });
  };

  // Esc, scroll lock, initial focus
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    getLenis()?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.documentElement.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus trap
  const trap = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !dialog.current) return;
    const f = dialog.current.querySelectorAll<HTMLElement>("button, video[controls]");
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onKeyDown={trap}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
    >
      <div ref={back} onClick={close} className="absolute inset-0 bg-night/90 backdrop-blur-sm" />
      <button
        ref={closeBtn}
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
        </svg>
      </button>
      <div
        ref={frame}
        className="relative overflow-hidden rounded-3xl bg-ink shadow-glow"
        style={{ aspectRatio: String(item.aspect), width: `min(92vw, calc(85vh * ${item.aspect}))` }}
      >
        {item.kind === "video" ? (
          <video
            className="h-full w-full object-cover"
            poster={item.poster}
            autoPlay
            loop
            muted
            playsInline
            controls
            aria-label={item.alt}
          >
            {item.webm && <source src={item.webm} type="video/webm" />}
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          <Image src={item.src} alt={item.alt} fill sizes="92vw" className="object-cover" />
        )}
      </div>
    </div>,
    document.body,
  );
}
