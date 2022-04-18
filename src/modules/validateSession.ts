import { FastifyRequest } from 'fastify'
import ThrowableError from './throwableError'
import userSchema from '../schemas/user'
import { userCache } from './cache'

const currentUser = async (_id: string) => {
  if (await userCache.get(_id)) return (await userCache.get(_id))?.value

  const user = await userSchema.findById(_id)
  await userCache.set(_id, user)

  return user
}

const validateSession = async (request: FastifyRequest) => {
  try {
    const payload = await request.jwtVerify() as {
      user: string,
      bot: boolean
    }

    request['currentUser'] = await currentUser(payload.user)
    request['bot'] = payload.bot
  } catch (err) {
    throw new ThrowableError('Invalid Session')
  }
}

export default validateSession