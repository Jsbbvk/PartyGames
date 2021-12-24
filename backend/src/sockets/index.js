import { Server } from 'socket.io'
import { dropPlayerCollection, dropRoomCollection } from '../store/controllers'
import initRoomSocket from './socket-room'

export default async () => {
  const io = new Server(4001)

  await dropPlayerCollection()
  await dropRoomCollection()

  io.on('connection', (socket) => {
    console.log('connected')

    socket.on('disconnect', () => console.log('disconnected'))

    initRoomSocket(socket)
  })
}
