import { updatePlayer, leaveRoom, deleteRoom } from '../store/controllers'

const setPlayerName = (io) => async (data, cb) => {
  const { roomId, uuid, name } = data

  const { error } = await updatePlayer(uuid, { name })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })

  io.to(roomId).emit('update players')
}

const removePlayer = (io, socket) => async (data, cb) => {
  const { uuid, roomId } = data
  const { error, room } = await leaveRoom(roomId, uuid)

  if (error) {
    if (cb) cb({ error })
    return
  }

  socket.leave(roomId)

  if (cb) cb({ uuid })

  if (room.players.length === 0) await deleteRoom(roomId)
  else io.to(roomId).emit('update players')
}

const setMemeUrl = (io) => async (data, cb) => {
  const { uuid, url, roomId } = data

  const { error } = await updatePlayer(uuid, {
    memeUrl: url,
    'ready.captioning': true,
  })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })
  io.to(roomId).emit('update players')
}

export default async (io, socket) => {
  socket.on('set player name', setPlayerName(io))
  socket.on('remove player', removePlayer(io, socket))
  socket.on('set player meme url', setMemeUrl(io))
}
