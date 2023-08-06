
const io = require("socket.io")(5500,{cors:"http://localhost:5500"});

console.log("Server.js running on port 5500");

io.on("connection",(socket) => {
    socket.on("sender-join",(data) => {
        socket.join(data.uid)
    });
    socket.on("receiver-join", (data) => {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
    });
    socket.on("file-meta",(data) => {
        socket.in(data.uid).emit("fs-meta",data.metadata);
    });
    socket.on("fs-start",(data) => {
        socket.in(data.uid).emit('fs-share',{});
    });
    socket.on("file-raw",(data) => {
        socket.in(data.uid).emit("fs-share-recv",data.buffer);
    });
});


