import { to } from 'await-to-js'
import { MongoConnection } from './store'
import initSockets from './sockets'

const init = async () => {
  const [err] = await to(MongoConnection())
  if (err) console.log(err)

  initSockets()

  console.log('server listening on http://localhost:4001')
}

init()
