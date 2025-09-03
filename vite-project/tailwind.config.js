import { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-navy': 'var(--color-primary-navy)',
        'primary-navy-light': 'var(--color-primary-navy-light)',
        'primary-navy-dark': 'var(--color-primary-navy-dark)',
        'accent-gold': 'var(--color-accent-gold)',
        'accent-gold-light': 'var(--color-accent-gold-light)',
        'accent-gold-dark': 'var(--color-accent-gold-dark)',
        'neutral-gray': 'var(--color-neutral-gray)',
        'neutral-gray-light': 'var(--color-neutral-gray-light)',
        'neutral-gray-dark': 'var(--color-neutral-gray-dark)',
        'success-green': 'var(--color-success-green)',
        'warning-orange': 'var(--color-warning-orange)',
        'error-red': 'var(--color-error-red)',
        'background-light': 'var(--color-background-light)',
        'background-white': 'var(--color-background-white)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border-light': 'var(--color-border-light)',
        'border-medium': 'var(--color-border-medium)',
      },
      boxShadow: {
        'light': 'var(--shadow-light)',
        'medium': 'var(--shadow-medium)',
        'heavy': 'var(--shadow-heavy)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}