import fastify from 'fastify'
import mongoose from 'mongoose'
import compress from 'fastify-compress'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import rateLimit from 'fastify-rate-limit'
import oauth2 from 'fastify-oauth2'
import cookies from 'fastify-cookie'
import jwt from 'fastify-jwt'
import errors from './errors.json'
import oauth2Router from './routes/oauth2'

const api = fastify()

api.register(compress)
api.register(helmet)
api.register(cors, {
  origin
})
api.register(jwt, {
  secret: JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false
  }
})
api.register(cookies)
api.register(rateLimit, {
  max: RATE_LIMIT,
  timeWindow: 60000 // a minute
})
api.register(oauth2, {
  name: 'github',
  scope: ['identify'],
  credentials: {
     client: {
      id: GITHUB_CLIENT,
      secret: GITHUB_SECRET
    },
    auth: oauth2.GITHUB_CONFIGURATION
  },
  startRedirectPath: '/oauth2/continue',
  callbackUri: `${API}/oauth2/callback`
})

api.addHook('onRequest', async (request, reply) => {
  reply.header('access-control-allow-credentials', true)
  reply.header('cache-control', 'public, max-age=60')
})

api.addContentTypeParser('application/json', { parseAs: 'string' }, async (request, body, done) => {
  if (typeof body !== 'string') return
  
  try {
    done(null, JSON.parse(body))
  } catch (err) {
    done(new Error('Something Went Wrong'), undefined)
  }
})

api.register(oauth2Router, {
  prefix: '/oauth2'
})

api.setNotFoundHandler(async (request, reply) => {
  reply.statusCode = 404
  
  return {
    code: 404,
    message: 'Not Found'
  }
})

api.setErrorHandler(async (err, request, reply) => {
  const code = errors[err.message]
  reply.statusCode = code

  return {
    code,
    message: err.message
  }
})

const run = async () => {
  await mongoose.connect(MONGO)
  console.log('Successfully established a connection to the database.')

  await api.listen(PORT)
  console.log('Successfully launched the API.')
}
run()