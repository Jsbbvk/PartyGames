import { Server } from 'socket.io'
import initRoomSocket from './socket-room'

export default () => {
  const io = new Server(4001)

  io.on('connection', (socket) => {
    console.log('connected')

    socket.on('disconnect', () => console.log('disconnected'))

    initRoomSocket(socket)
  })
}
