/**
 * PostCSS Configuration
 *
 * Tailwind CSS 4 uses @tailwindcss/postcss plugin
 * No tailwind.config.js needed - all config in globals.css @theme
 */

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
