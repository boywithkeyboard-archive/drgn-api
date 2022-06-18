import mongoose from 'mongoose'
import type { Schema } from 'mongoose'

export type ServerDocument = {
  _id: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  createdAt: string
  updatedAt: string
}

const schema: Schema = new mongoose.Schema({
  host: String,
  port: Number,
  username: String,
  password: String,
  privateKey: String
}, { timestamps: true })

const serverSchema = mongoose.model<ServerDocument>('servers', schema)

export default serverSchema
