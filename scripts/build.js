import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'esm',
  external: ['./node_modules/*'],
  outfile: 'dist/index.js',
  define: {
    ENCRYPTION_KEY: JSON.parse(process.env.encryptionKey),
    JWT_SECRET: JSON.parse(process.env.jwtSecret),
    MONGO: JSON.parse(process.env.mongo),
    PORT: JSON.parse(process.env.port),
    DEV: false,
    RATE_LIMIT: JSON.parse(process.env.rateLimit)
  }
})
