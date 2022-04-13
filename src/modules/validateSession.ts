import { FastifyRequest } from 'fastify'
import getCurrentUser from './getCurrentUser'

export default async (request: FastifyRequest) => {
  try {
    await request.jwtVerify()

    const payload = await request.jwtDecode() as {
      user: string,
      bot: boolean
    }

    if (payload.bot) throw new Error('Invalid Session')

    request['user'] = await getCurrentUser(payload.user)
  } catch (err) {
    throw new Error('Invalid Session')
  }
}