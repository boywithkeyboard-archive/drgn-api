import mongoose, { Schema } from 'mongoose'

export type TeamDocument = {
  _id: string,
  name: string,
  admin: string,
  members: string[],
  createdAt: string,
  updatedAt: string
}

const teamSchema: Schema = new mongoose.Schema({
  name: String,
  admin: String,
  members: [String]
}, { timestamps: true })

export default mongoose.model<TeamDocument>('teams', teamSchema)