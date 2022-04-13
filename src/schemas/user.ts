import mongoose, { Schema } from 'mongoose'

export type UserDocument = {
  _id: string,
  github: string,
  teams: string[],
  createdAt: string,
  updatedAt: string
}

const userSchema: Schema = new mongoose.Schema({
  github: String,
  teams: [String]
}, { timestamps: true })

export default mongoose.model<UserDocument>('users', userSchema)