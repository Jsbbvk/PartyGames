import { Server } from 'socket.io'
import {
  deleteRoom,
  dropPlayerCollection,
  dropRoomCollection,
  getPlayerBySocketId,
  leaveRoom,
} from '../store/controllers'
import initRoomSocket from './socket-room'
import initPlayerSocket from './socket-player'

export default async () => {
  const io = new Server(4001)

  await dropPlayerCollection()
  await dropRoomCollection()

  io.on('connection', (socket) => {
    // console.log('connected')

    socket.on('disconnect', async () => {
      // removes players from room who refresh/leave page
      const { player, error } = await getPlayerBySocketId(socket.id)
      if (error) {
        console.log(error)
        return
      }

      if (!player) return

      const { roomId, _id: uuid } = player
      const { error: err, room } = await leaveRoom(roomId, uuid)
      if (err) {
        console.log(err)
        return
      }

      if (room.players.length === 0) await deleteRoom(roomId)
      else io.to(roomId).emit('update players')
    })

    socket.on('_health', (cb) => {
      if (cb) cb('OK')
    })

    initRoomSocket(io, socket)
    initPlayerSocket(io, socket)
  })
}
