/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102A43",
        muted: "#52606D",
        paper: "#FFFFFF",
        soft: "#F5F7FA",
        line: "#CBD2D9",
        primary: "#0B5FFF",
        primaryDark: "#084ECC",
        success: "#0F766E",
        warning: "#9A6700",
        danger: "#B42318",
      },
      fontSize: {
        base: ["1.125rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.55" }],
        xl: ["1.5rem", { lineHeight: "1.35" }],
        "2xl": ["2rem", { lineHeight: "1.2" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 42, 67, 0.10)",
      },
    },
  },
  plugins: [],
}
