var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {    //event was emitted from the client to the server, message will get fetched by createMessage listener on the server
    from: 'Andrew',
    text: 'hey, this is andrew.',
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//listen to custom events
socket.on('newMessage', function (message){   //event was emitted from the server to the clien, this listener listened to on the client
  console.log('new message', message);
});
