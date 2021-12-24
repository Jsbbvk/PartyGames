import { ROOM_INACTIVE_TIMEOUT } from '../store/constants'
import {
  getRoom,
  createPlayer,
  createRoom,
  deleteRoom,
} from '../store/controllers'

const deleteRoomIfInactive = async (roomId) => {
  const { room, error } = await getRoom(roomId, true)

  if (error) return { error }
  if (!room) return {}

  const { updatedAt } = room
  if (new Date() - updatedAt > ROOM_INACTIVE_TIMEOUT) {
    const { roomId: rmId, error: err } = await deleteRoom(roomId)
    if (err) return { error: err }
    return { roomId }
  }
  return {}
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

  const { uuid, error: errorCreate } = await createPlayer(name, roomId)
  if (errorCreate) {
    if (cb) cb({ error: errorCreate })
    return
  }

  socket.join(roomId)
  if (cb) cb({ uuid, name })
}

const joinRoom = (socket) => async (data, cb) => {
  const { roomId, name } = data

  const { roomId: delRoomId, error: delErr } = await deleteRoomIfInactive(
    roomId
  )
  if (delErr) {
    if (cb) cb({ error: delErr })
    return
  }

  const { uuid, error } = await createPlayer(name, roomId)
  if (error) {
    if (cb) cb({ error })
    return
  }

  socket.join(roomId)
  socket.to(roomId).emit('player join', { name, uuid })

  if (cb) cb({ uuid })
}

export default (socket) => {
  socket.on('create room', createAndJoinRoom(socket))
  socket.on('join room', joinRoom(socket))
}
