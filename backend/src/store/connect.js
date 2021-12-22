import mongoose from 'mongoose'

const uri = 'mongodb://127.0.0.1:27017/party_games'

const setUp = () => {
  return new Promise((res, rej) => {
    mongoose.connect(uri).catch((err) => {
      console.error(err)
      rej(new Error('db failed'))
    })

    const db = mongoose.connection
    db.once('open', function callback() {
      console.log('connected to mongodb')
      res('connected')
    })
  })
}

export default setUp
