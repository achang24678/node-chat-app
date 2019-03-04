var socket = io();


function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');    // last item in the list
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();  9// move to previous child

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);

  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else{
      console.log('no error');
    }
  });
});


socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

//listen to custom events
socket.on('newMessage', function (message){   //event was emitted from the server to the client, this listener listened to on the client
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();    //use jquery call the id property then .html method which gon return the markup inside of message template
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // console.log('new message', message);
  // var li = jQuery('<li></li>');               //formatting the message other user sends in and put on main chat
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);     //formatting the message other user sends in
  //
  // jQuery('#messages').append(li);     //put in the list (var li) - if there are already 3 items in the list, it gon be 4th one
});

// socket.emit('createMessage', {      //send from client to the server, and send back a callback function that shows up on server letting us kno the case was sucessful
//   from: 'Frank',
//   text: 'Hi'
// }, function(data) {
//   console.log('Got it', data);
// });


//fetch coordinates and url info generated from ./message - generateLocationMessage function,
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');               //list tag, showing each user with message
  // var a = jQuery('<a target="_blank">My current location</a>');   //anchor tag = link tag / with target set to _blank, we open up new tab when click on this link

  // li.text(`${message.from}: ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});


// jQuery listenr wait for info from the form of "message-form" and the user input in that field
jQuery('#message-form').on('submit', function (event) {
  event.preventDefault(); // prevents the defaul behaviors - prevent the refresh of the page in this case

  var messageTextbox = jQuery('[name=message]'); //store user input in var messageTextbox

  socket.emit('createMessage', {      // once we get the user input data, we then emit the value
    text: messageTextbox.val()    //user input value
  }, function () {
    messageTextbox.val('');   //clear text field after message was sent
  });
});



var locationButton = jQuery('#send-location');
locationButton.on('click', function () {    //click listener for location button
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location ...');     //disable the button to prevent multi-span on the button from user

  navigator.geolocation.getCurrentPosition(function (position) { //find the coordinates
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {      //emit latitude and longitude of the user
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  });
});
