/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "serif"],
        libre: ["Libre Baskerville", "serif"],
        Frank: ["Frank Ruhl Libre", "serif"],
      },
      height: {
        heroHeight: "500px",
      },
      fontSize: {
        herosm: "20px",
        heromd: "60px",
      },

      maxWidth: {
        maxsm: "150px",
        maxmd: "400px",
      },
    },
  },
  plugins: [],
};
