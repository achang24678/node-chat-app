const path = require('path');
const http = require('http');   // it's a built in node module, no need to install it
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();  //create new express app
var server = http.createServer(app);
var io = socketIO(server);  // we get our web sockets server on here we can emitting or listening to events (communicate between server and client)



app.use(express.static(publicPath));  //configure our middleware

//let u register an event listener, connection lets u listen for a new connection meaning that a client connected to the server, it lets you do something when that connection comes in
io.on('connection', (socket) => {
  console.log('New user connected');

// when user logon to the server, they gonna see this message first
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // user who log on to the chat app won't see this block of message, but other who already logged on will see new user joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


  socket.on('createMessage', (message, callback) => {    //listener, listen for event typed, emitted from the client on the localhost
    console.log('createMessage', message);
    //io.emit emits an event to every single connection here (when we get one user creating message and send to server, server sends back to all connections of this server)
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');   //gets the callback - console.log('Got it', data);

    //this lets the socket IO library know which user shouldn't get the event (send to everybody but this socket, user who fire out the message won't see the message like welcome Allen)
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

 server.listen(port, () => {   // call app.listen - changed to server.listen beacuse of we used http
  console.log(`Server is up on ${port}`);
});
