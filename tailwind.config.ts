import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:        '#f5f0e8',
        'cream-dark': '#ede5d6',
        white:        '#fdfcf9',
        ink:          '#1e1e1b',
        'ink-light':  '#3a3a36',
        gold:         '#c4a050',
        'gold-light': '#d4b870',
        'gold-dark':  '#b89a5a',
        forest:       '#2d3d2f',
        'forest-dark':'#0d110e',
        sage:         '#7a8c6e',
        clay:         '#b05c3a',
        stone:        '#8a7f72',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-raleway)', 'system-ui', 'sans-serif'],
        body:  ['var(--font-garamond)', 'Georgia', 'serif'],
      },
      animation: {
        'rise':     'rise 0.8s ease both',
        'bob':      'bob 2.2s ease-in-out infinite',
        'kenburns': 'kenburns 22s ease-in-out infinite alternate',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bob: {
          '0%,100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%':     { transform: 'translateX(-50%) translateY(7px)' },
        },
        kenburns: {
          '0%':   { transform: 'scale(1) translate(0,0)' },
          '50%':  { transform: 'scale(1.08) translate(-1%,.5%)' },
          '100%': { transform: 'scale(1.14) translate(1%,-1%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
