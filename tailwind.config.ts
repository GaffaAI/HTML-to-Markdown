import type { Config } from "tailwindcss";
import { GAFFA_THEME } from "@gaffaai/uikit";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@gaffaai/uikit/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ...GAFFA_THEME.extend,
    },
  },
  plugins: [],
} satisfies Config;
