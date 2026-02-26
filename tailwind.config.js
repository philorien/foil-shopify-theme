/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Design tokens mapped to CSS custom properties set in theme.liquid.
      // These respond to Shopify theme editor settings in real time.
      //
      // NOTE: Tailwind opacity modifier syntax (e.g. bg-primary/50) does not
      // work with CSS variable hex colors. If opacity variants are needed,
      // switch to storing raw RGB values in the CSS variables and use the
      // rgb(var(--color-primary-rgb) / <alpha-value>) pattern.
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      fontSize: {
        base: 'var(--font-size-base)',
        // Heading type scale — driven by --heading-scale set in theme.liquid
        h6: 'var(--font-size-h6)',
        h5: 'var(--font-size-h5)',
        h4: 'var(--font-size-h4)',
        h3: 'var(--font-size-h3)',
        h2: 'var(--font-size-h2)',
        h1: 'var(--font-size-h1)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius-base)',
        sm: 'var(--border-radius-sm)',
        lg: 'var(--border-radius-lg)',
        full: 'var(--border-radius-full)',
      },
      maxWidth: {
        content: 'var(--max-width)',
      },
      spacing: {
        section: 'var(--section-spacing)',
        header: 'var(--header-height)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'slide-out-right': 'slide-out-right 300ms ease-in',
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-in',
      },
    },
  },
  plugins: [],
};
