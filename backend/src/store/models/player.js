import mongoose from 'mongoose'

const options = {
  collection: 'players',
}

const playerSchema = mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    socketId: String,
    points: {
      type: Number,
      default: 0,
    },
    memeUrl: String,
  },
  options
)

playerSchema.index({ socketId: 1 })

const Player = mongoose.model('Player', playerSchema)

export default Player
