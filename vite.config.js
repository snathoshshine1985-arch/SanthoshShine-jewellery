import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import cmsHandler from './api/cms.js'

// In dev, run the same serverless function (api/cms.js) that Vercel runs in production
const devApi = (env) => ({
  name: 'dev-api',
  configureServer(server) {
    process.env.CMS_API_URL = env.CMS_API_URL
    process.env.CMS_API_KEY = env.CMS_API_KEY
    server.middlewares.use('/api/cms', async (req, res) => {
      let raw = ''
      for await (const chunk of req) raw += chunk
      req.query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
      try {
        req.body = raw ? JSON.parse(raw) : undefined
      } catch {
        req.body = undefined
      }
      res.status = (code) => ((res.statusCode = code), res)
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }
      cmsHandler(req, res)
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // '' = also load non-VITE_ vars (server-only secrets)
  return {
    plugins: [react(), tailwindcss(), devApi(env)],
  }
})
