const socket = io('http://localhost:8000');

const form = document.getElementById("send-container")
const msgInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

var audio = new Audio("../notify.mp3")

function generateID(){
    return `${Math.trunc(Math.random()*999)} - ${Math.trunc(Math.random()*999)} - ${Math.trunc(Math.random()*999)}`
}
const generateBtn = () => {
    let code = document.getElementById('chatCode');
    document.getElementById('code').style.display = "inline-block";
    let roomID = code.innerText = generateID() ;
    socket.emit('new-user-joined',roomID);
    document.getElementById("joinMyRoom").style.display = "none";
}

const copybtn = () => {
    let text = document.getElementById('chatCode').innerText;
    navigator.clipboard.writeText(text);
    alert(`Copied ${text}`);
}

const joinBtn = () => {
    document.getElementById("createMyRoom").style.display = "none";
    document.getElementById("myRoomID").style.display = "block";
    document.getElementById("joinMyRoom").style.display = "none";
    document.getElementById("joinRoom").style.display = "block";
}
const join = () => {
    let chatCode = document.getElementById("myRoomID").value
    if(chatCode.length === 0) return;
    // if(arr.indexOf(chatCode) === -1){
    //     document.getElementById('code').innerText = "Invalid Room Id";
    // }
    //else{
        document.getElementById('code').innerText = "";
        socket.emit('new-user-joined',chatCode); 
        document.getElementById('decide-part').style.display = "none";
        document.getElementById('parent').style.display = "flex";
        socket.emit("event-name");
    //}
    
}

const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageElement.classList.add("message");
    messageContainer.append(messageElement);
    if(position !== "right") audio.play();
    messageContainer.scrollTo(0,document.body.scrollHeight)
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msgInput.value;
    if(message.length !== 0){
        append(`${message}`,'right');
    socket.emit('send-message',message);
    msgInput.value = '';}
});

socket.on('my-event', () => {
    document.getElementById('decide-part').style.display = "none";
    document.getElementById('parent').style.display = "flex";  
})

socket.on('user-joined',name => {
    append(`${name} joined the chat`,'center');
});

socket.on('received',data => {
    append(`${data.name} : ${data.message}`,'left');
});

socket.on('disconnected', name => {
    append(`${name} has disconnected from the server!`,'center')
})