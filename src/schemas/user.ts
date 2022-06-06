import mongoose from 'mongoose'
import type { Schema } from 'mongoose'

export type UserDocument = {
  _id: string,
  email: string,
  password?: string,
  secret?: string,
  createdAt: string,
  updatedAt: string
}

const userSchema: Schema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String
}, { timestamps: true })

export default mongoose.model<UserDocument>('users', userSchema)
