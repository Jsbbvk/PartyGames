import { to } from 'await-to-js'
import { Player, Room } from '../models'
import { ERRORS } from '../constants'
import { Error } from '../util'

export const getRoom = async (roomId, lean = false) => {
  const [err, room] = await to(Room.findOne({ roomId }).lean(lean))
  if (err) {
    console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { room }
}

export const getPlayers = async (roomId) => {
  const [err, room] = await to(
    Room.findOne({ roomId }).select('players').populate('players').lean()
  )
  if (err) {
    console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  if (!room) {
    console.log("room doesn't exist")
    return Error(ERRORS.ROOM_NOT_EXIST)
  }

  return { players: room.players }
}

export const createRoom = async (roomId) => {
  const [err, room] = await to(Room.findOne({ roomId }).lean())
  if (err) return Error(ERRORS.UNEXPECTED_ERROR)
  if (room) return Error(ERRORS.DUPLICATE_ROOM)

  const [errCreate, newRoom] = await to(Room.create({ roomId }))

  if (errCreate) {
    console.log(errCreate)
    if (errCreate.code === 11000) {
      return Error(ERRORS.DUPLICATE_ROOM)
    }
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { roomId }
}

// export const joinRoom = async (roomId, uuid) => {
//   const [err, room] = await to(Room.findOne({ roomId }))
//   if (err) {
//     console.log(err)
//     return Error(ERRORS.UNEXPECTED_ERROR)
//   }

//   if (!room) {
//     console.log("room doesn't exist")
//     return Error(ERRORS.ROOM_NOT_EXIST)
//   }

//   room.players.push(uuid)
//   const [saveErr] = await to(room.save())
//   if (saveErr) {
//     console.log(err)
//     return Error(ERRORS.UNEXPECTED_ERROR)
//   }

//   return { roomId }
// }

export const leaveRoom = async (roomId, uuid) => {
  const [err] = await to(
    Room.findOneAndUpdate(
      { roomId },
      {
        $pull: { players: uuid },
      }
    )
  )

  // TODO see if this is empty

  if (err) {
    console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { uuid }
}

export const deleteRoom = (roomId) => {}

export const dropCollection = async () => {
  const [err] = await to(Room.collection.drop())
  if (err) console.log(err)
}
