import 'dotenv/config'
import { build } from 'esbuild'

(async () => {
  await build({
    entryPoints: ['./src/index.ts'],
    outfile: './build/index.js',
    bundle: true,
    minify: true,
    platform: 'node',
    define: {
      DEV: false,
      ENCRYPTION_KEY: JSON.stringify(process.env.ENCRYPTION_KEY),
      JWT_SECRET: JSON.stringify(process.env.JWT_SECRET),
      MONGO: JSON.stringify(process.env.MONGO),
      APP: JSON.stringify(process.env.APP),
      API: JSON.stringify(process.env.API),
      PORT: JSON.stringify(process.env.PORT),
      GITHUB_CLIENT: JSON.stringify(process.env.GITHUB_CLIENT),
      GITHUB_SECRET: JSON.stringify(process.env.GITHUB_SECRET),
      RATE_LIMIT: 100
    }
  })
})()