import mongoose from 'mongoose'
import options from '../config'

export const connect = (url = options.dbUrl, opts = {}) => {
  return mongoose.connect(
    process.env.MONGODB_URI || url,
    { ...opts, useNewUrlParser: true }
  )
}
