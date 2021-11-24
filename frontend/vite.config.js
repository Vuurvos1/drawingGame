import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
  base: './',
  plugins: [
    svelte({
      /* plugin options */
      preprocess: sveltePreprocess(),
    }),
  ],
});
