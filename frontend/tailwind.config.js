/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'brand-accent': 'var(--brand-accent)',
        'brand-text': 'var(--brand-text)',
        'brand-heading': 'var(--brand-heading)',
        'brand-background': 'var(--brand-background)',
        'brand-white': 'var(--brand-white)',
        'brand-border': 'var(--brand-border)',
        'brand-lightBg': 'var(--brand-lightBg)',
        'brand-success': 'var(--brand-success)',
      }
    },
  },
  plugins: [],
}
