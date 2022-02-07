import { getRoom, updatePlayer } from '../../store/Cardsforus/controllers'

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

export default (io, socket) => {
  socket.on('reconnect', reconnect(io, socket))
  socket.on('leave socket room', leave(socket))
}
