//Node server which will handle all Socket.io chatting connections
const io = require('socket.io')(8000,{cors : 'https://chatbox-o38b.onrender.com'});


//Dictionary to maintain rooms and its users
const users = {}

console.log("Index.js running on port 8000");

io.on('connection',socket => {
    //user has joined
    socket.on('new-user-joined', (roomID,userName) =>{
        socket.join(roomID);
        users[socket.id] = [roomID,userName];
        socket.to(users[socket.id][0]).emit('user-joined',userName);
        
    });
    //Just to redirect the user to chat window
    socket.on('event-name',() =>{
        if(users[socket.id] === undefined) return;
        socket.to(users[socket.id][0]).emit('my-event');

    })
    //User send a message
    socket.on('send-message',(message) => {
        if(users[socket.id] === undefined) return;
        socket.to(users[socket.id][0]).emit('received', {message : message,name : users[socket.id][1]})
    });

    //User Disconnected
    socket.on("disconnect",() => {
        if(users[socket.id] === undefined) return;
        socket.to(users[socket.id][0]).emit('disconnected',users[socket.id][1]);
        socket.leave(users[socket.id][0]);
        if(Object.keys(users).length === 0)  delete users;
    })
});

