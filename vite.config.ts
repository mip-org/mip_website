import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'dist/index.html'),
          resolve(__dirname, 'dist/404.html')
        )
      },
    },
    {
      // /install_mip.m is the downloadable form of /install.txt;
      // public/install.txt is the single source for both
      name: 'install-mip-download',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.split('?')[0] === '/install_mip.m') {
            res.setHeader('Content-Type', 'text/plain')
            res.end(readFileSync(resolve(__dirname, 'public/install.txt')))
            return
          }
          next()
        })
      },
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'dist/install.txt'),
          resolve(__dirname, 'dist/install_mip.m')
        )
      },
    },
  ],
})
