/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta da Loja da Madrinha — tons quentes de biscoito
        biscoito: {
          50: "#fdf8f0",
          100: "#faefd9",
          200: "#f4ddb0",
          300: "#ecc57e",
          400: "#e2a44a",
          500: "#d9892a",
          600: "#c06e1e",
          700: "#9f541b",
          800: "#80431c",
          900: "#69381a",
        },
        creme: {
          50: "#fffdf7",
          100: "#fff9eb",
          200: "#fef0cc",
          300: "#fde3a0",
          400: "#fbd06e",
          500: "#f9bb44",
          600: "#f0a020",
          700: "#c97d18",
          800: "#a06019",
          900: "#834f1b",
        },
      },
      fontFamily: {
        sans: ["Open Sans", "ui-sans-serif", "system-ui"],
        display: ["EB Garamond", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
