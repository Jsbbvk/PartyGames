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
    points: Number,
    memeUrl: String,
  },
  options
)

const Player = mongoose.model('Player', playerSchema)

export default Player
