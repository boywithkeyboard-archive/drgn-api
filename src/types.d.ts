import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { FastifyInstance, FastifyLoggerInstance } from 'fastify'
import type { IncomingMessage, Server, ServerResponse } from 'http'

export type Router = FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance, TypeBoxTypeProvider>
