import mongoose from 'mongoose'
import { GAMEPLAY_STATES, STATES } from '../constants'

const options = {
  collection: 'cardsforus:rooms',
  timestamps: true,
}

const roomSchema = mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'CardsForUsPlayer',
      },
    ],
    state: {
      type: String,
      enum: Object.values(STATES),
      default: STATES.WAITING,
    },
    gameplayState: {
      type: String,
      enum: Object.values(GAMEPLAY_STATES),
    },
    allowSkipping: {
      type: Boolean,
      default: true,
    },
    cardPack: {
      type: String,
      default: 'Cards Against Humanity',
    },
  },
  options
)

roomSchema.index({ roomId: 1 })

const Room = mongoose.model('CardsForUsRoom', roomSchema)

export default Room
