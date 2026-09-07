/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F3EE',
        ink: '#1B2430',
        'ink-soft': '#3A4657',
        blueprint: '#2F5D8A',
        'blueprint-light': '#C7D9E8',
        amber: '#D98A34',
        done: '#4B7B5E',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
      },
    },
  },
  plugins: [],
}
