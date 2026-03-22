/** @type {import('tailwindcss').Config} */
export default {
  // 1. ADD THIS BLOCK TO PROTECT YOUR OLD CSS
  corePlugins: {
    preflight: false,
  },

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}