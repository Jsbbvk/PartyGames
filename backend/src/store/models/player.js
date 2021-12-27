import mongoose from 'mongoose'

const options = {
  collection: 'players',
}

export const defaultPlayer = {
  points: 0,
  ready: {
    captioning: false,
    voting: false,
    results: false,
  },
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
    votedPlayer: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Player',
    },
    memeUrl: String,
    ready: {
      captioning: {
        type: Boolean,
        default: false,
      },
      voting: {
        type: Boolean,
        default: false,
      },
      results: {
        type: Boolean,
        default: false,
      },
    },
  },
  options
)

playerSchema.index({ socketId: 1 })

const Player = mongoose.model('Player', playerSchema)

export default Player
