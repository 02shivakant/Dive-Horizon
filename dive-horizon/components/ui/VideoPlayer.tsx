"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import TrailerPoster from "./TrailerPoster";

type Props = {
  srcMp4?: string;
  srcWebm?: string;
  poster?: string;
  captions?: string;
  onError?: () => void;
};

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

const btn =
  "flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/15";

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export default function VideoPlayer({
  srcMp4 = "/media/trailer.mp4",
  srcWebm = "/media/trailer.webm",
  poster = "/media/poster.jpg",
  captions = "/media/trailer-captions.vtt",
  onError,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [cc, setCc] = useState(true);
  const [fs, setFs] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started) video.current?.play().catch(() => {});
  }, [started]);

  useEffect(() => {
    const t = video.current?.textTracks[0];
    if (t) t.mode = cc ? "showing" : "hidden";
  }, [cc, started]);

  useEffect(() => {
    const onFs = () => setFs(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const seek = (val: number) => {
    if (video.current) video.current.currentTime = val;
    setTime(val);
  };

  const setVol = (val: number) => {
    const v = video.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
  };

  const fullscreen = () => {
    const el = wrap.current;
    const v = video.current as FsVideo | null;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el?.requestFullscreen) el.requestFullscreen();
    else v?.webkitEnterFullscreen?.();
  };

  const handleFail = () => {
    setFailed(true);
    setStarted(false);
    onError?.();
  };

  return (
    <div ref={wrap} className="group relative aspect-video w-full overflow-hidden bg-ink">
      {!started && !failed && <TrailerPoster poster={poster} onPlay={() => setStarted(true)} />}

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p className="max-w-sm text-sm font-semibold text-cream/80">
            Trailer file not found. Add trailer.mp4 and trailer.webm to public/media.
          </p>
        </div>
      )}

      {started && (
        <>
          <video
            ref={video}
            className="h-full w-full cursor-pointer object-contain"
            poster={poster}
            preload="none"
            playsInline
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onVolumeChange={(e) => {
              setMuted(e.currentTarget.muted);
              setVolume(e.currentTarget.volume);
            }}
          >
            <source src={srcWebm} type="video/webm" />
            <source src={srcMp4} type="video/mp4" onError={handleFail} />
            <track kind="captions" src={captions} srcLang="en" label="English" default />
          </video>

          <div
            className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-night/90 to-transparent px-3 pb-2 pt-10 transition-opacity duration-300 sm:px-5 ${
              playing ? "opacity-0 focus-within:opacity-100 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              className="h-2 w-full cursor-pointer accent-gold"
            />
            <div className="flex items-center gap-1">
              <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={btn}>
                <Icon>{playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4.5v15l13-7.5z" />}</Icon>
              </button>
              <span className="min-w-[5.5rem] text-xs font-bold tabular-nums text-cream/90">
                {fmt(time)} / {fmt(duration)}
              </span>
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => video.current && (video.current.muted = !video.current.muted)}
                aria-label={muted ? "Unmute" : "Mute"}
                className={btn}
              >
                <Icon>
                  {muted || volume === 0 ? (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
                  )}
                </Icon>
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => setVol(Number(e.target.value))}
                aria-label="Volume"
                className="hidden h-2 w-20 cursor-pointer accent-gold sm:block"
              />
              <button
                type="button"
                onClick={() => setCc((c) => !c)}
                aria-label={cc ? "Hide captions" : "Show captions"}
                aria-pressed={cc}
                className={`${btn} ${cc ? "text-gold" : ""}`}
              >
                <Icon>
                  <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1z" />
                </Icon>
              </button>
              <button type="button" onClick={fullscreen} aria-label={fs ? "Exit fullscreen" : "Fullscreen"} className={btn}>
                <Icon>
                  {fs ? (
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  ) : (
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  )}
                </Icon>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
