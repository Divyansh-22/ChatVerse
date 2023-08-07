//Node server which will handle all Socket.io file sharing connections
const io = require("socket.io")(5500,{cors:"https://file-share-aab9.onrender.com"});

console.log("Server.js running on port 5500");

io.on("connection",(socket) => {
    //Sender has initiated a request
    socket.on("sender-join",(data) => {
        socket.join(data.uid)
    });
    //Receiver has joined
    socket.on("receiver-join", (data) => {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
    });
    //meta data of the file
    socket.on("file-meta",(data) => {
        socket.in(data.uid).emit("fs-meta",data.metadata);
    });
    //To file sharing starts
    socket.on("fs-start",(data) => {
        socket.in(data.uid).emit('fs-share',{});
    });
    //file sharing continued
    socket.on("file-raw",(data) => {
        socket.in(data.uid).emit("fs-share-recv",data.buffer);
    });
});


