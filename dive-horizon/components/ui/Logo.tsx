export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const px = size === "lg" ? 48 : 28;
  const id = `logo-orb-${size}`;
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={px} height={px} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <radialGradient id={id} cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#ffc94a" />
            <stop offset="1" stopColor="#f98350" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="15" r="15" fill="#f98350" opacity="0.22" />
        <circle cx="16" cy="15" r="10" fill={`url(#${id})`} />
        <path d="M2 27c5-7 9-9 14-9s9 2 14 9v5H2Z" fill="#7a3b52" />
      </svg>
      <span className={`font-heading font-semibold tracking-tight text-cream ${size === "lg" ? "text-xl" : "text-sm"}`}>
        Dive Horizon
      </span>
    </span>
  );
}
