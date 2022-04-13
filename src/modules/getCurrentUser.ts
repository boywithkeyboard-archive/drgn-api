import userSchema, { UserDocument } from '../schemas/user'
import { userCache } from './cache'


export default async (_id: string) => {
  const user = (await userCache.get(_id) ?? await userSchema.findOne({ _id })) as UserDocument
  if (!(await userCache.has(_id))) await userCache.set(_id, user)

  return user
}