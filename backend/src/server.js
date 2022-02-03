import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { to } from 'await-to-js'
import { MongoConnection } from './store'
import initSockets from './sockets'

require('dotenv').config()

const init = async () => {
  const [err] = await to(MongoConnection())
  if (err && process.env.NODE_ENV === 'development') console.log(err)

  await initSockets()

  console.log(`node env: ${process.env.NODE_ENV}`)
  console.log(`server listening on port ${process.env.PORT || 4001}`)
}

init()
