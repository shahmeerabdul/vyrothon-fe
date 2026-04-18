/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0e1a",
          800: "#0f1422",
          700: "#171d2e",
          600: "#222a3f",
        },
        accent: {
          cyan: "#22d3ee",
          violet: "#a78bfa",
          lime: "#a3e635",
          amber: "#fbbf24",
          rose: "#fb7185",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.35), 0 8px 40px -8px rgba(34,211,238,0.25)",
        "glow-decrypt":
          "0 0 0 1px rgba(251,113,133,0.4), 0 8px 40px -8px rgba(251,113,133,0.3)",
      },
      keyframes: {
        "flow-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(300%)", opacity: "0" },
        },
        "flow-up": {
          "0%": { transform: "translateY(300%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "flow-down": "flow-down 1.8s linear infinite",
        "flow-up": "flow-up 1.8s linear infinite",
        pop: "pop 180ms ease-out",
      },
    },
  },
  plugins: [],
};
