var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});


socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//listen to custom events
socket.on('newMessage', function (message){   //event was emitted from the server to the clien, this listener listened to on the client
  console.log('new message', message);
});
