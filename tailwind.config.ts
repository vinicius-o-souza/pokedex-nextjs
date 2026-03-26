import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts}",
  ],
  safelist: [
    "bg-brand-yellow",
    "bg-brand-yellow-dark",
    "bg-brand-green",
    "bg-brand-red",
    "text-brand-yellow",
    "text-brand-yellow-dark",
    "text-brand-green",
    "text-brand-red",
    "hover:bg-brand-yellow",
    "hover:bg-brand-yellow-dark",
    "hover:text-brand-yellow",
    "hover:text-brand-yellow-dark",
    "border-brand-yellow",
    "focus:ring-brand-yellow",
    "ring-brand-yellow",
    "accent-brand-yellow",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      colors: {
        brand: {
          yellow: "#FCD307",
          "yellow-dark": "#E6BE00",
          green: "#4CAF50",
          red: "#E53935",
        },
      },
    },
  },
  plugins: [],
};

export default config;
