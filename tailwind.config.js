/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: "#12181B",
        paper: "#F6F4EF",
        signal: "#2F6F5E",
        signal2: "#3F8A73",
        clay: "#C8622A",
        line: "#DCD6C8",
        muted: "#6B6459",
      },
    },
  },
  plugins: [],
};
