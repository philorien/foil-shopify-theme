import shopify from 'vite-plugin-shopify';

export default {
  plugins: [
    shopify({
      sourceCodeDir: 'src',
      entrypointsDir: 'src/entrypoints',
      snippetFile: 'vite-tag.liquid',
    }),
  ],
  build: {
    // Prevent inlining assets — they must go through Shopify CDN
    assetsInlineLimit: 0,
    // Don't wipe assets/ on build — it may contain static assets not managed by Vite
    emptyOutDir: false,
  },
};
