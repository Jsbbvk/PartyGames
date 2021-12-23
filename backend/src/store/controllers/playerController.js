import { to } from 'await-to-js'
import { Player, Room } from '../models'
import { ERRORS } from '../constants'
import { Error } from '../util'

export const getPlayer = async (uuid, lean = false) => {
  const [err, player] = await to(Player.findById(uuid).lean(lean))
  if (err) {
    console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  if (!player) {
    console.log('cannot find player')
    return Error(ERRORS.PLAYER_NOT_FOUND)
  }

  return player
}

export const createPlayer = async (name, roomId) => {
  const [err, room] = await to(Room.findOne({ roomId }))
  if (err) {
    console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  if (!room) {
    console.log("room doesn't exist")
    return Error(ERRORS.ROOM_NOT_EXIST)
  }

  const [playerErr, player] = await to(Player.create({ name, roomId }))
  if (playerErr) {
    console.log(playerErr)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  room.players.push(player._id)
  const [saveErr] = await to(room.save())
  if (saveErr) {
    console.log(saveErr)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { uuid: player._id }
}

export const setPlayerName = async (uuid, name) => {
  const [err] = await to(
    Player.findOneAndUpdate({ _id: uuid }, { $set: { username: name } })
  )

  if (err) {
    console.log(err)
    return Error(ERRORS.UNEXPECTED_ERROR)
  }

  return { uuid }
}

export const dropCollection = async () => {
  const [err] = await to(Player.collection.drop())
  if (err) console.log(err)
}