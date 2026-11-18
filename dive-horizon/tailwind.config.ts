import type { Config } from "tailwindcss";

// Colors mirror the CSS variables in app/globals.css. Keep both in sync.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sun: "#f98350",
        dusk: "#7a3b52",
        ridge: "#2e4543",
        night: "#15191e",
        violet: "#5b3df5",
        lavender: "#9db0ff",
        cream: "#fff1dc",
        gold: "#ffc94a",
        ink: "#1a1214",
      },
      fontFamily: {
        heading: ["var(--font-unbounded)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-quicksand)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 48px rgba(91, 61, 245, 0.45)",
        "glow-gold": "0 8px 30px rgba(255, 201, 74, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
