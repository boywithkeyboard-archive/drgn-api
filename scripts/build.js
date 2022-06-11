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
    ENCRYPTION_KEY: JSON.stringify(process.env.encryptionKey),
    JWT_SECRET: JSON.stringify(process.env.jwtSecret),
    MONGO: JSON.stringify(process.env.mongo),
    PORT: JSON.stringify(process.env.port),
    DEV: false,
    RATE_LIMIT: JSON.stringify(process.env.rateLimit),
    EMAIL_USER: JSON.stringify(process.env.emailUser),
    EMAIL_PASSWORD: JSON.stringify(process.env.emailPassword)
  }
})
