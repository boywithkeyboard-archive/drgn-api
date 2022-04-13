import mongoose from 'mongoose'

export default async (request: { [key: string]: any }) => {
  const id = request.params.id

  if (!id || id === '' || !mongoose.Types.ObjectId.isValid(id)) throw Error('Invalid Id')

  const newObjectId = new mongoose.Types.ObjectId(id)
  if (newObjectId != id) throw new Error('Invalid Id')
}