import { GAMEPLAY_STATES } from '../../store/Cardsforus/constants'
import {
  deletePlayer,
  deleteRoom,
  getPlayers,
  getRoom,
  leaveRoom,
  resetPlayers,
  updatePlayer,
} from '../../store/Cardsforus/controllers'
import { setRoomGameplayState } from './socket-room'

export const checkGameStateReady = async (io, roomId, gameState) => {
  const stateToReady = {
    [GAMEPLAY_STATES.choosing_card]: 'chooseCard',
    [GAMEPLAY_STATES.choosing_card_czar]: 'chooseCzarCard',
    [GAMEPLAY_STATES.results]: 'nextRound',
  }

  let state = gameState
  if (!gameState) {
    const { room } = await getRoom(roomId, true)
    if (!room) return false
    state = room.gameplayState
  }

  const { players } = await getPlayers(roomId)
  if (!players) return false

  const numReady = players.reduce(
    (accum, curr) => accum + (curr.ready[stateToReady[state]] ? 1 : 0),
    0
  )

  if (state === GAMEPLAY_STATES.results) {
    if (numReady === players.length) {
      const czar = players.find((p) => p.isCzar)

      // TODO handle case when czar or czar.chosenWinner is undefined

      await updatePlayer(czar._id, {
        $set: { isCzar: false },
      })

      await updatePlayer(czar.chosenWinner, {
        $set: { isCzar: true },
      })

      await resetPlayers(roomId, false)
      await setRoomGameplayState(io)({
        roomId,
        state: GAMEPLAY_STATES.choosing_card_czar,
      })
      return true
    }
  } else if (state === GAMEPLAY_STATES.choosing_card) {
    if (numReady === players.length - 1) {
      await setRoomGameplayState(io)({
        roomId,
        state: GAMEPLAY_STATES.choosing_winning_card,
      })
      return true
    }
  }

  return false
}

const setCard = (io) => async (data, cb) => {
  if (!data) return
  const { roomId, uuid, cardId, isCzar } = data

  const { error } = await updatePlayer(uuid, {
    $set: {
      chosenCard: cardId,
      [`ready.${isCzar ? 'chooseCzarCard' : 'chooseCard'}`]: true,
    },
  })

  if (error) {
    if (cb) cb({ error })
    return
  }

  if (cb) cb({ uuid })
  if (isCzar)
    await setRoomGameplayState(io)({
      roomId,
      state: GAMEPLAY_STATES.choosing_card,
    })
  else {
    const readyNext = await checkGameStateReady(
      io,
      roomId,
      GAMEPLAY_STATES.choosing_card
    )
    if (!readyNext) io.to(roomId).emit('update players')
  }
}

const setWinningCard = (io) => async (data, cb) => {
  if (!data) return
  const { roomId, uuid, id } = data

  const { error } = await updatePlayer(uuid, {
    $set: {
      chosenWinner: id,
    },
  })

  if (error) {
    if (cb) cb({ error })
    return
  }

  const { error: pointError } = await updatePlayer(id, {
    $inc: {
      points: 1,
    },
  })

  if (pointError) {
    if (cb) cb({ error: pointError })
    return
  }

  if (cb) cb({ uuid })

  io.to(roomId).emit('update players')

  await setRoomGameplayState(io)({
    roomId,
    state: GAMEPLAY_STATES.results,
  })
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

  const readyNextRound = await checkGameStateReady(
    io,
    roomId,
    GAMEPLAY_STATES.results
  )
  if (!readyNextRound) io.to(roomId).emit('update players')
}

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
    await checkGameStateReady(io, roomId)
  }
}

export default async (io, socket) => {
  socket.on('set card', setCard(io))
  socket.on('set winning card', setWinningCard(io))
  socket.on('set player ready', setPlayerReady(io))
  socket.on('set player name', setPlayerName(io))
  socket.on('remove player', removePlayer(io))
}
