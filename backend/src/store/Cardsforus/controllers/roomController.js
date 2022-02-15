import { to } from 'await-to-js'
import { defaultPlayer, Player, Room } from '../models'
import { ERRORS } from '../constants'
import { Error } from '../util'

export const resetPlayers = async (roomId, resetAll = true) => {
  const [err, room] = await to(
    Room.findOne({ roomId }).select('players').lean()
  )
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  if (!room) {
    if (process.env.NODE_ENV === 'development') console.log('room not found')
    return Error(ERRORS.ROOM_NOT_EXIST)
  }

  const resetValues = {
    ...defaultPlayer,
    ...(resetAll && { points: 0, isCzar: false }),
  }

  const [error] = await to(
    Player.updateMany(
      { _id: { $in: room.players } },
      {
        $set: resetValues,
      }
    )
  )

  if (error) {
    if (process.env.NODE_ENV === 'development') console.log(error)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { roomId }
}

export const getRoom = async (roomId, lean = false) => {
  const [err, room] = await to(Room.findOne({ roomId }).lean(lean))

  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }
  return { room }
}

export const getPlayers = async (roomId) => {
  const [err, room] = await to(
    Room.findOne({ roomId }).select('players').populate('players').lean()
  )
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  if (!room) {
    if (process.env.NODE_ENV === 'development')
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
    if (process.env.NODE_ENV === 'development') console.log(errCreate)
    if (errCreate.code === 11000) {
      return Error(ERRORS.DUPLICATE_ROOM)
    }
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { roomId }
}

export const leaveRoom = async (roomId, uuid) => {
  const [err, room] = await to(
    Room.findOneAndUpdate(
      { roomId },
      {
        $pull: { players: uuid },
      },
      { new: true }
    )
  )

  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { uuid, room }
}

export const deleteRoom = async (roomId) => {
  const [err] = await to(Room.deleteOne({ roomId }))
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { roomId }
}

export const setRoomState = async (roomId, state) => {
  const [err] = await to(Room.findOneAndUpdate({ roomId }, { $set: { state } }))

  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { roomId }
}

export const updateRoom = async (roomId, update) => {
  const [err] = await to(Room.findOneAndUpdate({ roomId }, update))

  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { roomId }
}

export const dropCollection = async () => {
  const [err] = await to(Room.collection.drop())
  if (err && process.env.NODE_ENV === 'development') console.log(err)
}
