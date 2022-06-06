export {}

declare global {
  const ENCRYPTION_KEY: string
  const JWT_SECRET: string
  const MONGO: string
  const PORT: number
  const DEV: boolean
  const RATE_LIMIT: number
}
