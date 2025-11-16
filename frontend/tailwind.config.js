/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "508px",
        // => @media (min-width: 640px) { ... }
        md: "756px",
        // => @media (min-width: 768px) { ... }
        lg: "1014px",
        // => @media (min-width: 1076px) { ... }
        xl: "1231px",
        // => @media (min-width: 1024px) { ... }
        "2xl": "1460px",
        // => @media (min-width: 1280px) { ... }
        "3xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      boxShadow: {
        "15": "5px 5px 15px gray",
      },
    },
  },
  plugins: [],
};
