//Node server which will handle all Socket.io connections
const io = require('socket.io')(8000,{cors : 'https://chatbox-o38b.onrender.com'});

const users = {}

console.log("Index.js running on port 8000");

io.on('connection',socket => {
    socket.on('new-user-joined', roomID =>{
        socket.join(roomID);
        //let userName = prompt("Enter your name");
        userName = "Dev";
        users[socket.id] = [roomID,userName];
        socket.to(users[socket.id][0]).emit('user-joined',userName);
        
    });
    socket.on('event-name',() =>{
        if(users[socket.id] === undefined) return;
        socket.to(users[socket.id][0]).emit('my-event');

    })
    socket.on('send-message',(message) => {
        if(users[socket.id] === undefined) return;
        socket.to(users[socket.id][0]).emit('received', {message : message,name : users[socket.id][1]})
    });
    // socket.on("disconnecting", () => {
    //     socket.leave(users[socket.id][0])
    //     socket.to(users[socket.id][0]).emit('disconnected',users[socket.id][1]);
    
    // })
    socket.on("disconnect",() => {
        if(users[socket.id] === undefined) return;
        socket.to(users[socket.id][0]).emit('disconnected',users[socket.id][1]);
        socket.leave(users[socket.id][0]);
        if(Object.keys(users).length === 0)  delete users;
    })
});

