import type { Metadata, Viewport } from "next";
import { Unbounded, Quicksand } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/layout/Navbar";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const title = `${SITE.name}: ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["Dive Horizon", "Android game", "one-tap runner", "endless runner", "sunset game"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title,
    description: SITE.description,
    url: "/",
    locale: "en_US",
    // Image comes from app/opengraph-image.tsx automatically
  },
  twitter: { card: "summary_large_image", title, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#15191e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-loading="true"
      className={`${unbounded.variable} ${quicksand.variable}`}
      suppressHydrationWarning
    >
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}html[data-loading]{overflow:auto!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
