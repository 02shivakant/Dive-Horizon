import Image from "next/image";

export default function TrailerPoster({
  poster,
  onPlay,
  label = "Play trailer",
}: {
  poster: string;
  onPlay: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={label}
      className="group/poster absolute inset-0 block h-full w-full"
    >
      <Image
        src={poster}
        alt="Dive Horizon trailer poster: the orb gliding over sunset hills"
        fill
        sizes="(min-width: 1024px) 960px, 100vw"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-night/30 transition-colors group-hover/poster:bg-night/10" />
      <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink shadow-glow-gold transition-transform duration-300 group-hover/poster:scale-110 sm:h-28 sm:w-28">
        <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 sm:h-11 sm:w-11" fill="currentColor" aria-hidden="true">
          <path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z" />
        </svg>
      </span>
    </button>
  );
}
