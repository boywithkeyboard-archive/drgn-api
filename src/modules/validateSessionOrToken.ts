import { FastifyRequest } from 'fastify'
import getCurrentUser from './getCurrentUser'

export default async (request: FastifyRequest) => {
  try {
    await request.jwtVerify()

    const payload = await request.jwtDecode() as {
      user: string,
      bot: boolean
    }

    request['user'] = await getCurrentUser(payload.user)
    request['bot'] = payload.bot
  } catch (err) {
    throw new Error('Invalid Session')
  }
}