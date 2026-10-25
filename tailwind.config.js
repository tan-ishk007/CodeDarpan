/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F2EBDD',
        ink: '#1D1A18',
        oxblood: '#8F3030',
        brass: '#AF8C57',
        sage: '#7C8980',
        paper: '#FAF7F0',
        border: '#D8CCB7',
        muted: '#6E6961',
      },
    },
  },
  plugins: [],
};
