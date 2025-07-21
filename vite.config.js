import {
  defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   '/': 'http://localhost:3000',
    // }
    watch: {
      ignored: ['**/server/data/**json']
    }
  },
  plugins: [react(), tailwindcss()],
})