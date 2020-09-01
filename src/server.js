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
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
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
      io.on('connect', (socket) => {
        socket.on('join', ({ name, room }, callback) => {
          const { error, user } = addUser({ id: socket.id, name, room });
      
          if(error) return callback(error);
      
          socket.join(user.room);
      
          socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
          socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
      
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      
          callback();
        });
      
        socket.on('sendMessage', (message, callback) => {
          const user = getUser(socket.id);
      
          io.to(user.room).emit('message', { user: user.name, text: message });
      
          callback();
        });
      
        socket.on('disconnect', () => {
          const user = removeUser(socket.id);
      
          if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
          }
        })
      });
    })
  } catch (e) {
    console.error(e)
  }
}

