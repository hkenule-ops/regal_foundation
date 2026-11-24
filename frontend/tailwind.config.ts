import type { Config } from "tailwindcss";

/**
 * Palette sampled from the Regal Health and Humanity Foundation logo.
 * Token names are unchanged so every existing page picks up the new colours:
 *   navy  -> deep logo blue      gold       -> logo lime green (primary accent)
 *   cream -> logo paper tone     gold-light -> lighter lime
 * New tokens: sky (bright blue) and forest (text green).
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        regal: {
          navy: "#03447D",
          charcoal: "#14283D",
          gold: "#86B207",
          "gold-light": "#A3CC1E",
          cream: "#F9F6EF",
          earth: "#4F6B5C",
          sky: "#0374BA",
          forest: "#067517",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;