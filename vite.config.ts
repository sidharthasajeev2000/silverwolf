import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The custom domain serves assets from the root, including on nested routes.
// A project-domain build can use: npm run build -- --base=/silverwolf/
export default defineConfig({
  plugins: [react()],
  base: '/',
})
