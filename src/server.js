import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { signup, signin, protect } from './utils/auth'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import itemRouter from './resources/item/item.router'
import listRouter from './resources/list/list.router'
import socketio from 'socket.io';
import http from 'http';

export const app = express()
let server;
let io;

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api', protect)
app.use('/api/user', userRouter)
app.use('/api/item', itemRouter)
app.use('/api/list', listRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

export const start = async () => {
  try {
    await connect()
    server = app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
      io = socketio(server);
      io.on('connection', (socket) => {
        console.log('We have a new connection');
        socket.on('disconnect', () => {
          console.log('user left the chat');
        });
      });
    })
  } catch (e) {
    console.error(e)
  }
}

