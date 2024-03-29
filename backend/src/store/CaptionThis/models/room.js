import mongoose from 'mongoose'
import { STATES } from '../constants'

const options = {
  collection: 'captionthis:rooms',
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
        ref: 'CaptionThisPlayer',
      },
    ],
    state: {
      type: String,
      enum: Object.values(STATES),
      default: STATES.WAITING,
    },
    memeChoices: {
      type: Number,
      default: 10,
    },
  },
  options
)

roomSchema.index({ roomId: 1 })

const Room = mongoose.model('Room', roomSchema)

export default Room
