import mongoose from 'mongoose'
import ThrowableError from './throwableError'

export default async (request: { [key: string]: any }) => {
  const id = request.params.id

  if (!id || id === '' || !mongoose.Types.ObjectId.isValid(id)) throw new ThrowableError('Invalid Id')

  const newObjectId = new mongoose.Types.ObjectId(id)
  if (newObjectId != id) throw new ThrowableError('Invalid Id')
}