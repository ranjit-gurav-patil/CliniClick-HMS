import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add this exact line. It must match your GitHub repository name exactly!
  base: '/CliniClick-HMS/', 
})