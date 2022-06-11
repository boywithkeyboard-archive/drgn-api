import 'dotenv/config'
import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'
import mongoose from 'mongoose'
import { globalCache } from './modules/cache'
import authRouter from './routes/auth'
import userRouter from './routes/users'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

const api = fastify({
  ajv: {
    customOptions: {
      strict: 'log',
      keywords: ['kind', 'modifier']
    }
  }
}).withTypeProvider<TypeBoxTypeProvider>()

await api.register(fastifyCompress)

await api.register(fastifyHelmet)

await api.register(fastifyCors, {
  origin: '*'
})

await api.register(fastifyJwt, {
  secret: JWT_SECRET
})

await api.register(fastifyRateLimit, {
  max: RATE_LIMIT,
  timeWindow: 60000 // a minute
})

api.addHook('onRequest', async (request, reply) => {
  reply.header('cache-control', 'public, max-age=30')
})

/*
api.register(serverRouter, {
  prefix: '/servers'
})
*/

await api.register(userRouter, {
  prefix: '/users'
})

await api.register(authRouter, {
  prefix: '/'
})

api.setNotFoundHandler(async (request, reply) => {
  reply.statusCode = 404
  
  return {
    statusCode: 404,
    message: 'Not Found'
  }
})

api.setErrorHandler(async err => {
  return {
    statusCode: 400,
    error: 'Bad Request',
    message: err.message ? err.message : 'something went wrong'
  }
})

api.get('/download', {
  schema: {
    querystring: Type.Object({
      platform: Type.Optional(
        Type.String()
      ),
      format: Type.Optional(
        Type.String()
      )
    })
  }
}, async (request, reply) => {
  const latestVersion = await globalCache.get('latestVersion')

  if (!latestVersion) {
    const { tag_name } = await (await fetch('https://api.github.com/repos/drgnjs/drgn/releases/latest')).json()

    await globalCache.set('latestVersion', tag_name)
  }

  if (request.query.platform === 'windows')
    return reply.redirect(`https://github.com/drgnjs/drgn/releases/download/${latestVersion}/drgn_${latestVersion.replace('v', '')}_x64_en-US.msi`)

  if (request.query.platform === 'linux')
    if (request.query.format === 'deb')
      return reply.redirect(`https://github.com/drgnjs/drgn/releases/download/${latestVersion}/drgn_${latestVersion.replace('v', '')}_amd64.deb`)
    else if (request.query.format === 'tar.gz')
      return reply.redirect(`https://github.com/drgnjs/drgn/releases/download/${latestVersion}/drgn.app.tar.gz`)
    else if (request.query.format === 'AppImage')
      return reply.redirect(`https://github.com/drgnjs/drgn/releases/download/${latestVersion}/drgn.app.tar.gz`)
    else
      return 'Invalid Format'

  if (request.query.platform === 'mac')
    return reply.redirect(`https://github.com/drgnjs/drgn/releases/download/${latestVersion}/drgn_${latestVersion.replace('v', '')}_x64.dmg`)

  return 'Invalid Platform'
})

await mongoose.connect(MONGO)

await api.listen({
  host: '127.0.0.1',
  port: PORT
})

console.log('API running!')
