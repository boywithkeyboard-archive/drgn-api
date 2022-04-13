import mongoose, { Schema } from 'mongoose'

export type ServerDocument = {
  _id: string,
  team: string,
  user: string,
  ip: string,
  password: string,
  sshKey: string,
  createdAt: string,
  updatedAt: string
}

const serverSchema: Schema = new mongoose.Schema({
  team: String,
  user: String,
  ip: String,
  password: String,
  sshKey: String
}, { timestamps: true })

export default mongoose.model<ServerDocument>('servers', serverSchema)