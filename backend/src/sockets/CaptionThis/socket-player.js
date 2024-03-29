import {
  updatePlayer,
  leaveRoom,
  deleteRoom,
  deletePlayer,
  getPlayer,
} from '../../store/CaptionThis/controllers'

const setPlayerName = (io) => async (data, cb) => {
  if (!data) return
  const { roomId, uuid, name } = data

  const { error } = await updatePlayer(uuid, { $set: { name } })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })

  io.to(roomId).emit('update players')
}

const removePlayer = (io) => async (data, cb) => {
  if (!data) return
  const { uuid, roomId } = data

  const { error, room } = await leaveRoom(roomId, uuid)

  if (error) {
    if (cb) cb({ error })
    return
  }

  const { error: delErr } = await deletePlayer(uuid)
  if (delErr) {
    if (cb) cb({ error: delErr })
    return
  }

  if (cb) cb({ uuid })

  if (room && room.players.length === 0) await deleteRoom(roomId)
  else {
    io.to(roomId).emit('update players')
  }
}

const setMemeUrl = (io) => async (data, cb) => {
  if (!data) return
  const { uuid, url, roomId } = data

  const { error } = await updatePlayer(uuid, {
    $set: {
      memeUrl: url,
      'ready.captioning': true,
    },
  })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })
  io.to(roomId).emit('update players')
}

const setPlayerVote = (io) => async (data, cb) => {
  if (!data) return
  const { uuid, votedPlayer, roomId } = data

  const { error } = await updatePlayer(uuid, {
    $set: {
      'ready.voting': true,
      votedPlayer,
    },
  })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })
  io.to(roomId).emit('update players')
}

const setPlayerReady = (io) => async (data, cb) => {
  if (!data) return
  const { uuid, roomId, ready, isReady } = data

  const { error } = await updatePlayer(uuid, {
    $set: { [ready]: isReady },
  })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })
  io.to(roomId).emit('update players')
}

const addPointToPlayer = (io) => async (data, cb) => {
  if (!data) return
  const { roomId, uuid } = data

  const { error } = await updatePlayer(uuid, {
    $inc: {
      points: 1,
    },
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
  socket.on('remove player', removePlayer(io))
  socket.on('set player meme url', setMemeUrl(io))
  socket.on('set player vote', setPlayerVote(io))
  socket.on('set player ready', setPlayerReady(io))
  socket.on('add point to player', addPointToPlayer(io))
}
