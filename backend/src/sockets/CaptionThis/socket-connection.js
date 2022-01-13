import { getRoom, updatePlayer } from '../../store/CaptionThis/controllers'

const reconnect = (io, socket) => async (data) => {
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
}

const leave = (socket) => async (data) => {
  if (!data) return
  const { roomId } = data
  if (roomId) socket.leave(roomId)
}

// socket.on('disconnect', async () => {
//   removes players from room who refresh/leave page
//   TODO player cannot leave upon refresh/leaving the page
//   console.log('disconnected')
//   if (blurredSockets.get(socket.id)) return
//   const { player, error } = await getPlayerBySocketId(socket.id)
//   if (error) {
//     return
//   }
//   if (!player) return
//   const { roomId, _id: uuid } = player
//   const { error: err, room } = await leaveRoom(roomId, uuid)
//   if (err) {
//     return
//   }
//   if (room.players.length === 0) await deleteRoom(roomId)
//   else io.to(roomId).emit('update players')
// })

export default (io, socket) => {
  socket.on('reconnect', reconnect(io, socket))
  socket.on('leave socket room', leave(socket))
}
