/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        'sinapsis': '#f26d0a',
        'sinapsis-select': '#e05c00',
      },
      transitionDuration: {
        '1500': '1500ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 