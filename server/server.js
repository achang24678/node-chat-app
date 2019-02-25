const path = require('path');
const http = require('http');   // it's a built in node module, no need to install it
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();  //create new express app
var server = http.createServer(app);
var io = socketIO(server);  // we get our web sockets server on here we can emitting or listening to events (communicate between server and client)

app.use(express.static(publicPath));  //configure our middleware


//let u register an event listener, connection lets u listen for a new connection meaning that a client connected to the server, it lets you do something when that connection comes in
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

 server.listen(port, () => {   // call app.listen - changed to server.listen beacuse of we used http
  console.log(`Server is up on ${port}`);
});
