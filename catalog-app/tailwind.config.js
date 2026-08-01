/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        "primary": "#2b8cee",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "card-light": "#ffffff",
        "card-dark": "#1b2a38",
        "text-light": "#101922",
        "text-dark": "#f6f7f8",
        "subtext-light": "#6b7280",
        "subtext-dark": "#9ca3af",
        "border-light": "#e5e7eb",
        "border-dark": "#374151"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [],
}
