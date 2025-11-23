/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
 content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
         primary: "var(--primary)",
    secondary: "var(--secondary)",
    lightBg: "var(--light-bg)",
    darkBg: "var(--dark-bg)",
    textLight: "var(--text-light)",
    textDark: "var(--text-dark)",
      },
      backgroundColor: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        light: "var(--light-bg)",
        dark: "var(--dark-bg)",
      },
      textColor: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        light: "var(--text-light)",
        dark: "var(--text-dark)",
      },
      borderColor: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      },
    },
  },
  plugins: [],
};
