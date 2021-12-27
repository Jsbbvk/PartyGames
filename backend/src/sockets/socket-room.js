import { ROOM_INACTIVE_TIMEOUT, STATES } from '../store/constants'
import {
  getRoom as getRm,
  createPlayer,
  createRoom,
  deleteRoom,
  getPlayers,
  setRoomState as setRmState,
  resetPlayers,
} from '../store/controllers'

const deleteRoomIfInactive = async (roomId) => {
  return {}
  // const { room, error } = await getRm(roomId, true)
  // if (error) return { error }
  // if (!room) return {}
  // const { updatedAt } = room
  // if (new Date() - updatedAt > ROOM_INACTIVE_TIMEOUT) {
  //   const { roomId: rmId, error: err } = await deleteRoom(roomId)
  //   if (err) return { error: err }
  //   return { roomId }
  // }
  // return {}
}

const createAndJoinRoom = (socket) => async (data, cb) => {
  const { roomId, name } = data

  const { roomId: delRoomId, error: delErr } = await deleteRoomIfInactive(
    roomId
  )
  if (delErr) {
    if (cb) cb({ error: delErr })
    return
  }

  const { error } = await createRoom(roomId)
  if (error) {
    if (cb) cb({ error })
    return
  }

  const { uuid, error: errorCreate } = await createPlayer(
    name,
    roomId,
    socket.id
  )
  if (errorCreate) {
    if (cb) cb({ error: errorCreate })
    return
  }

  socket.join(roomId)
  if (cb) cb({ uuid, name, roomId })
}

const joinRoom = (io, socket) => async (data, cb) => {
  const { roomId, name } = data

  const { roomId: delRoomId, error: delErr } = await deleteRoomIfInactive(
    roomId
  )

  if (delErr) {
    if (cb) cb({ error: delErr })
    return
  }

  const { error: rmErr, room } = await getRm(roomId, true)
  if (rmErr) {
    if (cb) cb({ error: rmErr })
    return
  }

  if (room && room.state !== STATES.WAITING) {
    if (cb) cb({ error: 'Game in session' })
    return
  }

  const { uuid, error } = await createPlayer(name, roomId, socket.id)
  if (error) {
    if (cb) cb({ error })
    return
  }

  socket.join(roomId)
  io.to(roomId).emit('update players')

  if (cb) cb({ uuid })
}

const getRoomPlayers = async (data, cb) => {
  const { roomId } = data

  const { players, error } = await getPlayers(roomId)
  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ players })
}

const setRoomState = (io) => async (data, cb) => {
  const { roomId, state } = data
  const { error } = await setRmState(roomId, state)
  if (error) {
    if (cb) cb({ error })
    return
  }

  io.to(roomId).emit('room state change', { state })

  if (cb) cb({ roomId })
}

const startGame = (io) => async (data, cb) => {
  const { roomId } = data
  const { error } = await resetPlayers(roomId)
  if (error) {
    if (cb) cb({ error })
    return
  }

  await setRoomState(io)(data, cb)
}

const getRoom = async (data, cb) => {
  const { roomId } = data

  const res = await getRm(roomId, true)
  if (cb) cb(res)
}

export default async (io, socket) => {
  socket.on('create room', createAndJoinRoom(socket))
  socket.on('join room', joinRoom(io, socket))
  socket.on('get players', getRoomPlayers)
  socket.on('set room state', setRoomState(io))
  socket.on('start game', startGame(io))
  socket.on('get room', getRoom)
}
