import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base + a runtime <base href> so the shop works on both
// github.io/silverwolf/ and the apex domain silverwolf.in.
export default defineConfig({
  plugins: [react()],
  base: './',
})
