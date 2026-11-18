"use client";

import { useState } from "react";
import TrailerPoster from "./TrailerPoster";

export function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

// Click-to-load facade: no YouTube code loads until the visitor clicks play.
export default function YouTubeFacade({ url, poster = "/media/poster.jpg" }: { url: string; poster?: string }) {
  const [active, setActive] = useState(false);
  const id = getYouTubeId(url);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-ink">
      {!id ? (
        <p className="flex h-full items-center justify-center p-6 text-center text-sm font-semibold text-cream/80">
          Invalid YouTube URL.
        </p>
      ) : active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title="Dive Horizon trailer"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <TrailerPoster poster={poster} onPlay={() => setActive(true)} />
      )}
    </div>
  );
}
