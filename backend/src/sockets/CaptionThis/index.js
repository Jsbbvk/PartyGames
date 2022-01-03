import { Server } from 'socket.io'
import {
  deleteRoom,
  dropPlayerCollection,
  dropRoomCollection,
  getPlayerBySocketId,
  getRoom,
  leaveRoom,
  updatePlayer,
} from '../../store/CaptionThis/controllers'
import initRoomSocket from './socket-room'
import initPlayerSocket from './socket-player'

export default async () => {
  const io = new Server(process.env.PORT || 4001, {
    // cors: {
    //   origin: ['http://localhost:3000', 'http://10.0.0.16:3000'],
    //   methods: ['GET', 'POST'],
    // },
  })
  const blurredSockets = new Map()

  await dropPlayerCollection()
  await dropRoomCollection()

  io.on('connection', (socket) => {
    // console.log('connected', socket.id)

    socket.on('reconnect', async (data) => {
      if (!data) return
      const { uuid, roomId } = data

      socket.join(roomId)
      const { error } = await updatePlayer(uuid, {
        $set: { socketId: socket.id },
      })

      if (error) return

      const { error: err, room } = await getRoom(roomId, true)
      if (err || !room) return

      io.to(socket.id).emit('update players')
      io.to(socket.id).emit('room state change', { state: room.state })
    })

    socket.on('disconnect', async () => {
      // removes players from room who refresh/leave page
      // TODO player cannot leave upon refresh/leaving the page
      // console.log('disconnected')
      // if (blurredSockets.get(socket.id)) return
      // const { player, error } = await getPlayerBySocketId(socket.id)
      // if (error) {
      //   return
      // }
      // if (!player) return
      // const { roomId, _id: uuid } = player
      // const { error: err, room } = await leaveRoom(roomId, uuid)
      // if (err) {
      //   return
      // }
      // if (room.players.length === 0) await deleteRoom(roomId)
      // else io.to(roomId).emit('update players')
    })

    socket.on('_health', (cb) => {
      if (cb) cb('OK')
    })

    socket.on('leave socket room', (data) => {
      if (!data) return
      const { roomId } = data
      if (roomId) socket.leave(roomId)
    })

    initRoomSocket(io, socket)
    initPlayerSocket(io, socket)
  })
}
