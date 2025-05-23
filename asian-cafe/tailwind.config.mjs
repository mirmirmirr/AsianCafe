/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        yellow: '#f9f36e',
        red: '#ee1c27',
        pink: '#f2d4d7',
        lightgreen: '#E3ECB7',
        darkgreen: '#7DA840',
        gold: '#efbf04',
      },
      fontFamily: {
        euphoria: ["var(--font-euphoria)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
