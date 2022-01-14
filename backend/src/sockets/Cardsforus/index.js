import {
  dropPlayerCollection,
  dropRoomCollection,
} from '../../store/Cardsforus/controllers'
import initRoomSocket from './socket-room'
import initPlayerSocket from './socket-player'

export default async (io) => {
  await dropPlayerCollection()
  await dropRoomCollection()

  const cardsforusNamespace = io.of('/cardsforus')
  cardsforusNamespace.on('connection', (socket) => {
    socket.on('_health', (cb) => {
      if (cb) cb('OK')
    })

    initRoomSocket(cardsforusNamespace, socket)
    initPlayerSocket(cardsforusNamespace, socket)
  })
}
