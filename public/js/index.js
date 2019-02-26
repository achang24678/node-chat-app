var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});


socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//listen to custom events
socket.on('newMessage', function (message){   //event was emitted from the server to the client, this listener listened to on the client
  console.log('new message', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from} says : ${message.text}`);

  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {      //send from client to the server, and send back a callback function that shows up on server letting us kno the case was sucessful
//   from: 'Frank',
//   text: 'Hi'
// }, function(data) {
//   console.log('Got it', data);
// });

// wait for info from the form of message-form and the user input in that field
jQuery('#message-form').on('submit', function (event) {
  event.preventDefault(); // prevents the defaul behaviors - prevent the refresh of the page in this case

  socket.emit('createMessage', {      // once we get the user input, we emit the value
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
