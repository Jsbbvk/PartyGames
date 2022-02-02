import { GAMEPLAY_STATES } from '../../store/Cardsforus/constants'
import { getPlayers, updatePlayer } from '../../store/Cardsforus/controllers'
import { setRoomGameplayState } from './socket-room'

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

  io.to(roomId).emit('update players')

  const { players } = await getPlayers(roomId)
  if (!players) return

  const numReady = players.reduce(
    (accum, curr) => accum + (curr.ready.chooseCard ? 1 : 0),
    0
  )

  if (numReady === players.length - 1) {
    await setRoomGameplayState(io)({
      roomId,
      state: GAMEPLAY_STATES.choosing_winning_card,
    })
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
  io.to(roomId).emit('update players')

  const { players } = await getPlayers(roomId)
  if (!players) return

  const numReady = players.reduce(
    (accum, curr) => accum + (curr.ready.nextRound ? 1 : 0),
    0
  )

  if (numReady === players.length) {
    await setRoomGameplayState(io)({
      roomId,
      state: GAMEPLAY_STATES.choosing_card_czar,
    })
  }
}

export default async (io, socket) => {
  socket.on('set card', setCard(io))
  socket.on('set winning card', setWinningCard(io))
  socket.on('set player ready', setPlayerReady(io))
}
