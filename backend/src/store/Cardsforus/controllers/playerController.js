import { to } from 'await-to-js'
import { Player, Room } from '../models'
import { ERRORS } from '../constants'
import { Error } from '../util'

export const getPlayerBySocketId = async (socketId, lean = false) => {
  const [err, player] = await to(Player.findOne({ socketId }).lean(lean))
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { player }
}

export const getPlayer = async (uuid, lean = false) => {
  const [err, player] = await to(Player.findById(uuid).lean(lean))
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { player }
}

export const createPlayer = async (name, roomId, socketId, options) => {
  const [err, room] = await to(Room.findOne({ roomId }))
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  if (!room) {
    if (process.env.NODE_ENV === 'development')
      console.log("room doesn't exist")
    return Error(ERRORS.ROOM_NOT_EXIST)
  }

  const [playerErr, player] = await to(
    Player.create({ name, roomId, socketId, ...options })
  )
  if (playerErr) {
    if (process.env.NODE_ENV === 'development') console.log(playerErr)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  room.players.push(player._id)
  const [saveErr] = await to(room.save())
  if (saveErr) {
    if (process.env.NODE_ENV === 'development') console.log(saveErr)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { uuid: player._id }
}

export const updatePlayer = async (uuid, update) => {
  const [err, player] = await to(
    Player.findOneAndUpdate({ _id: uuid }, update, { new: true })
  )

  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { player }
}

export const deletePlayer = async (uuid) => {
  const [err] = await to(Player.deleteOne({ _id: uuid }))
  if (err) {
    if (process.env.NODE_ENV === 'development') console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { uuid }
}

export const dropCollection = async () => {
  const [err] = await to(Player.collection.drop())
  if (err && process.env.NODE_ENV === 'development') console.log(err)
}
