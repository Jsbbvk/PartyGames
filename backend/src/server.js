import { Server } from 'socket.io'
import { MongoConnection } from './store'
import { to } from 'await-to-js'

const init = async () => {
  let [err] = await to(MongoConnection())
  if (err) console.log(err)

  const io = new Server(4001)

  io.on('connection', (socket) => {
    io.emit('welcome', { welcome: 'hi' })
    console.log('a user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}

init()
