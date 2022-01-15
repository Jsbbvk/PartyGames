import { GAMEPLAY_STATES } from '../../store/Cardsforus/constants'
import { getPlayers, updatePlayer } from '../../store/Cardsforus/controllers'

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
  io.to(roomId).emit('update players')
}

export default async (io, socket) => {
  socket.on('set card', setCard(io))
}
