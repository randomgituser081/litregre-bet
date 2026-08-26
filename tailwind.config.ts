import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0d0d0d",
          card: "#1a1a1a",
          raised: "#242424",
          border: "#2e2e2e",
        },
        accent: {
          green: "#26d657",
          "green-dim": "#1eb849",
          red: "#e83535",
          brand: "#c8102e",
        },
      },
      animation: {
        "pulse-odds": "pulseOdds 0.4s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
      },
      keyframes: {
        pulseOdds: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
