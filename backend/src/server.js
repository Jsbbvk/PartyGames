import { to } from 'await-to-js'
import { MongoConnection } from './store'
import initSockets from './sockets'

require('dotenv').config()

const init = async () => {
  const [err] = await to(MongoConnection())
  if (err && process.env.NODE_ENV === 'development') console.log(err)

  initSockets()

  console.log('server listening on http://localhost:4001')
}

init()
