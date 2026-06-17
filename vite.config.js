import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// Relative base works on both the project-pages subpath
// (jenslaufer.github.io/haus-tannheim/) and a custom domain on root.
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss(), imagetools()],
  build: {
    // Two pages: the live site and the legacy comparison page. They share the
    // same source images, so imagetools emits each WebP variant only once.
    rollupOptions: {
      input: {
        main: 'index.html',
        legacy: 'index2.html',
      },
    },
  },
})
