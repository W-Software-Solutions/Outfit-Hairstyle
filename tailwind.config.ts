import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A192F',
          800: '#112240',
        },
        aqua: '#64FFDA',
        coral: '#FF7A59',
        soft: {
          gray: '#8892B0',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(0,0,0,0.25)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['var(--font-body)', 'Inter', 'ui-sans-serif', 'system-ui'],
        code: ['var(--font-code)', 'Fira Code', 'ui-monospace'],
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
        'hero-gradient': 'radial-gradient(1000px 600px at 10% -10%, #132142 0%, #0A192F 55%)',
        'card-gradient': 'linear-gradient(180deg, #0f1b33 0%, #0a1428 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0px rgba(100,255,218,0.0)' }, '50%': { boxShadow: '0 0 24px rgba(100,255,218,0.3)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
