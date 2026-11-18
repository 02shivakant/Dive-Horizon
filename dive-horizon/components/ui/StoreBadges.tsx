import { SITE } from "@/lib/site";
import { PlayIcon } from "./icons";

// Google Play is the only live store. Add more badges to this array only when they are real.
const STORES = [{ name: "Google Play", kicker: "Get it on", href: SITE.playStoreUrl }];

export default function StoreBadges() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-4" aria-label="Download Dive Horizon">
      {STORES.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.kicker} ${s.name} (opens in a new tab)`}
            className="flex items-center gap-3 rounded-xl border border-cream/30 bg-ink px-5 py-2.5 text-cream transition-transform duration-300 hover:-translate-y-0.5 hover:border-gold"
          >
            <PlayIcon className="h-7 w-7 text-gold" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cream/70">{s.kicker}</span>
              <span className="font-heading text-lg font-semibold">{s.name}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
