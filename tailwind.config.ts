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
          DEFAULT: "var(--surface)",
          card: "var(--surface-card)",
          raised: "var(--surface-raised)",
          border: "var(--surface-border)",
        },
        ink: "var(--lg-ink)",
        muted: "var(--text-muted)",
        odds: {
          tint: "var(--odds-bg)",
          border: "var(--odds-border)",
          text: "var(--odds-text)",
        },
        accent: {
          green: "#22D366",
          "green-dim": "#16b355",
          lime: "#7CFF30",
          red: "#e83535",
          brand: "#22D366",
        },
        neon: {
          cyan: "#22D366",
          green: "#7CFF30",
        },
      },
      boxShadow: {
        "neon-cyan":
          "0 0 24px rgba(34, 211, 102, 0.22), inset 0 0 20px rgba(34, 211, 102, 0.04)",
        "neon-cyan-sm": "0 0 12px rgba(34, 211, 102, 0.35)",
        "neon-green": "0 0 20px rgba(124, 255, 48, 0.35)",
        "neon-green-sm": "0 0 12px rgba(34, 211, 102, 0.35)",
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
