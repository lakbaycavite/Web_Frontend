const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        primary: '#035594',
        secondary: '#32cc32'
      },
      fontFamily: {
        body: ['Poppins']
      },
      height: {
        120: '30rem'
      }
    },
  },
  plugins: [
    require('daisyui'),
    require("tailwindcss-animate"),
    // flowbite.plugin(),
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
  
}

