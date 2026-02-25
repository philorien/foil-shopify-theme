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
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius-base)',
      },
      maxWidth: {
        content: 'var(--max-width)',
      },
      spacing: {
        section: 'var(--section-spacing)',
      },
    },
  },
  plugins: [],
};
