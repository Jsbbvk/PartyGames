import { Server } from 'socket.io'
import initCaptionThisSocket from './CaptionThis'
import initCardsforusSocket from './Cardsforus'

export default async () => {
  const io = new Server(process.env.PORT || 4001, {
    // cors: {
    //   origin: ['http://localhost:3000'],
    //   methods: ['GET', 'POST'],
    // },
  })

  await initCaptionThisSocket(io)
  await initCardsforusSocket(io)
}
