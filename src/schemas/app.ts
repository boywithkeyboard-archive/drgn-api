import mongoose, { Schema } from 'mongoose'

export type AppDocument = {
  _id: string,
  name: string,
  language: string,
  framework: string,
  secrets: string,
  repository: string,
  team: string,
  user: string,
  servers: string[],
  createdAt: string,
  updatedAt: string
}

const appSchema: Schema = new mongoose.Schema({
  name: String,
  language: String,
  framework: String,
  secrets: String,
  repository: String,
  team: String,
  user: String,
  servers: [String]
}, { timestamps: true })

export default mongoose.model<AppDocument>('apps', appSchema)