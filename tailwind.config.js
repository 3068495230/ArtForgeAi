/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'af-bg': '#0a0a0f',
        'af-surface': '#14141c',
        'af-surface-hover': '#1a1a24',
        'af-ink': '#f0f0f5',
        'af-muted': '#8a8a9e',
        'af-rule': '#1e1e2e',
        'af-accent': '#00d4aa',
        'af-accent-soft': 'rgba(0,212,170,0.12)',
        'af-accent2': '#7b61ff',
        'af-danger': '#ff4d4d',
        'af-warning': '#ffaa00',
        'book-bg': '#f4e4bc',
        'book-surface': '#faf3e0',
        'book-ink': '#3d3226',
        'book-muted': '#7a6b58',
        'book-rule': '#d8c9a6',
        'book-accent': '#c9a86c',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
