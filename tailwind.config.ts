import type { Config } from "tailwindcss";

/**
 * VentureAI design tokens.
 * Palette: ink/slate base with a single "signal" accent (lime) reserved for
 * verdicts and scores. Verdict semantics: go=signal, improve=amber, avoid=coral.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0d10",
          900: "#0f1419",
          850: "#141b22",
          800: "#1a232c",
          700: "#243240",
          600: "#33475a",
        },
        paper: {
          0: "#ffffff",
          50: "#f7f8f9",
          100: "#eef1f3",
          200: "#dde3e8",
        },
        signal: {
          DEFAULT: "#c4f042",
          dim: "#9bbf2e",
          deep: "#5f7a18",
        },
        verdict: {
          go: "#54d178",
          improve: "#f5b945",
          avoid: "#f0674f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Numeric weight aliases so `font-500/600/700` resolve to real weights.
      fontWeight: {
        "400": "400",
        "500": "500",
        "600": "600",
        "700": "700",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
