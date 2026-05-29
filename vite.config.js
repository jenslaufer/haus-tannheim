import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Relative base works on both the project-pages subpath
// (jenslaufer.github.io/haus-tannheim/) and a custom domain on root.
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
})
