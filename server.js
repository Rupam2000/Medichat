const path = require('path');
const express = require('express');

const http = require('http');
const app = express();

const server = http.createServer(app);

const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');
const { fstat } = require('fs');
const io =  socketio(server);
const fsa= require('./file1')
 // Run when a client connects
 
 const botName = 'MediChat Bot';
 io.on('connection', socket => {
   socket.on('joinRoom',({username, room}) => {
   const user = userJoin(socket.id,username, room);
    socket.join(user.room);
    socket.emit('message',formatMessage(botName,'Welcome To MediChat'));
    //Broadcast when a server got into the chat room
    socket.broadcast.to(user.room).emit('message',`${user.username}  has joined the chat`);
 
   //Send Your Room Info
   io.to(user.room).emit('roomUsers',{
    room : user.room,
    users : getRoomUsers(user.room)
   });

    
  
   });
   // console.log('A new object has been crearted');
    



// Listen for the chat message
socket.on('chatMessage', msg =>{
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit('message',formatMessage(user.username,msg));
   fsa(msg);
});
//Runs when the client disconnects
socket.on('disconnect', () =>{
      const user = userLeave(socket.id);
      if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
      }

      //Send Your Room Info
      io.to(user.room).emit('roomUsers',{
        room : user.room,
        users : getRoomUsers(user.room)
       });
    
});
});

const PORT = 3000 || process.env.PORT ;


app.use(express.static(path.join(__dirname,'public')))
server.listen(PORT, () => console.log('Server is running on the port 3000'));


