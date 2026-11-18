# Dive Horizon landing page

Next.js 14 (App Router) + TypeScript + Tailwind + GSAP/ScrollTrigger + Lenis.

## Run
    npm install
    npm run dev   # http://localhost:3000

## Structure
- app/ – layout, page, globals.css, OG image, icon
- components/layout/ – Navbar (later Footer)
- components/providers/ – SmoothScroll (Lenis synced to ScrollTrigger)
- components/sections/ – one file per step (Hero, DiveScene, Trailer, ...)
- components/ui/ – Button, Logo, Preloader, icons (later VideoPlayer, Lightbox)
- lib/ – gsap.ts (plugin registration), lenis.ts, events.ts, site.ts (constants)
- public/media/ – replaceable media (see README inside)

Rule: import gsap only from "@/lib/gsap". Every GSAP component starts with "use client".
