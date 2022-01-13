import initCaptionThisRoomSocket from './socket-room'
import initCaptionThisPlayerSocket from './socket-player'
import initCaptionThisConnectionSocket from './socket-connection'
import {
  dropPlayerCollection,
  dropRoomCollection,
} from '../../store/CaptionThis/controllers'

export default async (io) => {
  await dropPlayerCollection()
  await dropRoomCollection()

  const captionthisNamespace = io.of('/captionthis')
  captionthisNamespace.on('connection', (socket) => {
    socket.on('_health', (cb) => {
      if (cb) cb('OK')
    })

    initCaptionThisRoomSocket(captionthisNamespace, socket)
    initCaptionThisPlayerSocket(captionthisNamespace, socket)
    initCaptionThisConnectionSocket(captionthisNamespace, socket)
  })
}
