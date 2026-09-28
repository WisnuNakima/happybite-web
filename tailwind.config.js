/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6EC',
        primary: '#E3A468',
        terracotta: '#D97742',
        golden: '#F5B942',
        chocolate: '#3D2B1F',
        canvas: '#FFF9F5',
        peach: '#FFF0E7',
        blush: '#FFE5D4',
        muted: '#827268',
        baked: '#A64B19',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
      boxShadow: {
        soft: '0 3px 5px -2px rgb(61 43 31 / 12%)',
        warm: '0 12px 24px -10px rgb(61 43 31 / 30%)',
      },
    },
  },
  plugins: [],
}
