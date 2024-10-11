/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        celadon: "#77d7c9",
        lavande: "#c89eff",
        celeste: "#bbdcff",
        bg: "#0d1126",
      },
    },
  },
  plugins: [],
};
