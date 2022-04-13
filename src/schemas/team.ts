import mongoose, { Schema } from 'mongoose'

export type TeamDocument = {
  _id: string,
  name: string,
  admin: string,
  createdAt: string,
  updatedAt: string
}

const teamSchema: Schema = new mongoose.Schema({
  name: String,
  admin: String
}, { timestamps: true })

export default mongoose.model<TeamDocument>('teams', teamSchema)