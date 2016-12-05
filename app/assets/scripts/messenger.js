// Socket IO code taken from: http://socket.io/get-started/chat/
$( document ).ready(function (){
    var socket = io();

    // On message send, submit text
    $('#messageInput').submit(function(event){

        event.preventDefault(); 

        // Get the current user to tag message with
        $.get('/currentUser', function(data){
            var currentUser = data;

            let message = currentUser + ': ' + $('#m').val();

            // Send a message to the IO socket
            socket.emit('chat message', message);

            // Reset the textbox to empty
            $('#m').val('');

            return false;
        });
    });

    // On receiving a message, add it to the chat box
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
})