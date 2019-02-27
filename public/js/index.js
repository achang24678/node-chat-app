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
  var li = jQuery('<li></li>');               //formatting the message other user sends in
  li.text(`${message.from} says : ${message.text}`);     //formatting the message other user sends in

  jQuery('#messages').append(li);     //put in the list - if there are already 3 items in the list, it gon be 4th one
});

// socket.emit('createMessage', {      //send from client to the server, and send back a callback function that shows up on server letting us kno the case was sucessful
//   from: 'Frank',
//   text: 'Hi'
// }, function(data) {
//   console.log('Got it', data);
// });


socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');   //with target set to _blank, we open up new tab when click on this link

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});


// jQuery listenr wait for info from the form of "message-form" and the user input in that field
jQuery('#message-form').on('submit', function (event) {
  event.preventDefault(); // prevents the defaul behaviors - prevent the refresh of the page in this case

  socket.emit('createMessage', {      // once we get the user input data, we then emit the value
    from: 'User',
    text: jQuery('[name=message]').val()    //user input
  }, function () {

  });
});



var locationButton = jQuery('#send-location');
locationButton.on('click', function () {    //click listener for location button
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(function (position) { //find the coordinates
    socket.emit('createLocationMessage', {      //emit latitude and longitude of the user
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});
