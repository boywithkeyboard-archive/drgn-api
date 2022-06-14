import type { UserDocument } from './schemas/user'
import type { FastifyInstance } from 'fastify'
import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { [key: string]: any }
    user: {
      email: string
      [key: string]: any
    }
  }
}

export type Router = FastifyInstance
