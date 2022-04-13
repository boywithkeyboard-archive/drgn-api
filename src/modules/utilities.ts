import mongoose from 'mongoose'
import { URL } from 'url'

export const isValidObjectId = async (id: any) => {
  if (!id || id === '' || !mongoose.Types.ObjectId.isValid(id)) return false

  const newObjectId = new mongoose.Types.ObjectId(id)
  if (newObjectId != id) return false

  return true
}

, isURL = async (url: string) => {
  try {
    new URL(url)
    return true
  } catch (err) {
    return false
  }
}

, validateObjectId = async (request: { [key: string]: any }) => {
  const id = request.params.id

  if (!id || id === '' || !mongoose.Types.ObjectId.isValid(id)) throw Error('Invalid Id')

  const newObjectId = new mongoose.Types.ObjectId(id)
  if (newObjectId != id) throw new Error('Invalid Id')
}

, readableSize = async (size: number) => {
  const stringSize: string = size.toString()
  const length = stringSize.length
  const round = async (number: number, decimalPlaces: number) => {
    return Number(Math.round(Number(number + 'e' + decimalPlaces)) + 'e' + -decimalPlaces)
  }

  if (length < 4)
    return `${size} B`
  
  if (length >= 4 && length < 7)
    return `${await round(size / 1000, 2)} KB`
  
  if (length >= 7 && length < 10)
    return `${await round(size / 1000000, 2)} MB`
  
  if (length >= 10 && length < 13)
    return `${await round(size / 1000000000, 2)} GB`
  
  if (length >= 13)
    return `${await round(size / 1000000000000, 2)} TB`

  return `${size}`
}
