/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // Corresponds to Chakra 'heading'
        body: ['Inter', 'sans-serif'],    // Corresponds to Chakra 'body'
      },
      // It's generally recommended to manage colors via the Chakra UI theme (theme.js)
      // and use Chakra's style props or CSS-in-JS capabilities for styling.
      // However, if you need to use Tailwind color classes directly for some reason,
      // you could define them here, ideally referencing your CSS variables or Chakra theme tokens.
      // Example for referencing CSS variables (defined in your global CSS, e.g., index.css):
      // colors: {
      //   'brand-primary': 'var(--color-brand-primary)',
      //   'brand-secondary': 'var(--color-brand-secondary)',
      //   // Ensure these CSS variables are defined, e.g., in src/index.css
      //   // :root {
      //   //   --color-brand-primary: #ff8fab; /* Example value */
      //   // }
      // }
    },
  },
  plugins: [],
}
