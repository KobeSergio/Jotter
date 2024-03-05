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
        mainGreen: "#BCE955",
        darkGreen: "#213D39",
        white: "#FFFFFF",
        gray: "#E5E9E7",
        buttonBorder: "#E2E8F0",
        textField: "#64748B",
        nav: "#8E8E93"
      },
    },
  },
  plugins: [],
};
export default config;
