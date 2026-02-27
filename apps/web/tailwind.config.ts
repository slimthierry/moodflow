import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/theme/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        surface: {
          primary: 'rgb(var(--theme-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--theme-bg-tertiary) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--theme-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--theme-text-tertiary) / <alpha-value>)',
          inverted: 'rgb(var(--theme-text-inverted) / <alpha-value>)',
        },
        edge: {
          primary: 'rgb(var(--theme-border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-border-secondary) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
