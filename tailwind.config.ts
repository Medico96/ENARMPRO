import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#111118",
          tertiary: "#1a1a24",
          card: "#15151f",
          elevated: "#1e1e2a",
        },
        text: {
          primary: "#f1f1f4",
          secondary: "#a0a0b4",
          muted: "#6b6b80",
          dim: "#4a4a5e",
        },
        accent: {
          primary: "#6366f1",
          secondary: "#06b6d4",
          hover: "#818cf8",
        },
        border: {
          DEFAULT: "#2a2a3a",
          light: "#1f1f2f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-space)"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
