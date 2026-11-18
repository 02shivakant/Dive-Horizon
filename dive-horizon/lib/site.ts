export const SITE = {
  name: "Dive Horizon",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "A one-tap sunset runner for Android",
  description:
    "Tap to dive down slopes, launch off crests and chase the sunset. Dive Horizon is a free one-tap runner for Android with daily rewards and global ranking.",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.Web3Task.DiveHorizon",
} as const;

export const NAV_LINKS = [
  { label: "Trailer", href: "#trailer" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "Rewards", href: "#rewards" },
] as const;
