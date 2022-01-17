import mongoose from 'mongoose'

const options = {
  collection: 'cardsforus:players',
}

export const defaultPlayer = {
  ready: {},
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
    chosenCard: Number,
    chosenWinner: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'CardsForUsPlayer',
    },
    isCzar: {
      type: Boolean,
      default: false,
    },
    ready: {
      chooseCard: {
        type: Boolean,
        default: false,
      },
      chooseCzarCard: {
        type: Boolean,
        default: false,
      },
      nextRound: {
        type: Boolean,
        default: false,
      },
    },
  },
  options
)

playerSchema.index({ socketId: 1 })

const Player = mongoose.model('CardsForUsPlayer', playerSchema)

export default Player
