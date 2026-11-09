import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#EFF6FF",
          secondary: "#DBEAFE",
          primary: "#2563EB",
          primaryHover: "#1D4ED8",
          navy: "#1E3A8A",
          navyDark: "#172554",
          sky: "#38BDF8",
          card: "#FFFFFF",
          text: "#0F172A",
          muted: "#64748B",
          border: "#DBEAFE",
          accent: "#0284C7",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(37, 99, 235, 0.07), 0 4px 6px -2px rgba(37, 99, 235, 0.03)",
        card: "0 4px 20px -2px rgba(30, 58, 138, 0.08)",
        hover: "0 10px 25px -3px rgba(37, 99, 235, 0.15)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;

