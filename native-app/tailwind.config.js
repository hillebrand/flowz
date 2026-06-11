/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        'flowz-purple': '#2C0094',
        'flowz-nav': '#C6C9FF',
      },
      fontFamily: {
        karla: ['Karla_400Regular'],
        'karla-medium': ['Karla_500Medium'],
        'karla-semibold': ['Karla_600SemiBold'],
        'karla-bold': ['Karla_700Bold'],
      },
    },
  },
  plugins: [],
};
