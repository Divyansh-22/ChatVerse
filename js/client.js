const socket = io('https://chatbox-o38b.onrender.com');

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
    let userName = prompt("Enter your name");
    while(userName == null){
        userName = prompt("please enter your name");
    }
    socket.emit('new-user-joined',roomID,userName);
    document.getElementById("joinMyRoom").style.display = "none";
}

const copybtn = () => {
    let text = document.getElementById('chatCode').innerText;
    navigator.clipboard.writeText(text);
    // alert(`Copied ${text}`);
    let myAlert = document.getElementById('alert');
    myAlert.style.display = "block";
    myAlert.innerText = `Copied ${text}`;
    //To disappear the alert
    setTimeout(() => {
        myAlert.style.display = "none";
    },1000);
    
    
}

const joinBtn = () => {
    document.getElementById("createMyRoom").style.display = "none";
    document.getElementById("joinMyRoom").style.display = "none";
    document.getElementById("enter-code").style.display = "block";
    // document.getElementById("myRoomID").style.display = "block";
    // document.getElementById("joinRoom").style.display = "block";
}
const join = () => {
    let chatCode = document.getElementById("myRoomID").value
    if(chatCode.length === 0) return;
    document.getElementById('code').style.display = "none";
    let userName = prompt("Enter your name");
    while(userName == null){
        userName = prompt("please enter your name");
    }
    socket.emit('new-user-joined',chatCode,userName); 
    document.getElementById('decide-part').style.display = "none";
    document.getElementById('parent').style.display = "flex";
    socket.emit("event-name");

}
//to append a message to the container
const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageElement.classList.add("message");
    messageContainer.append(messageElement);
    if(position !== "right") audio.play();
    messageContainer.scrollTo(0,document.body.scrollHeight)
}
//sending a message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msgInput.value;
    if(message.length !== 0){
        append(`${message}`,'right');
    socket.emit('send-message',message);
    msgInput.value = '';}
});

//redirect the user to chat-window
socket.on('my-event', () => {
    document.getElementById('decide-part').style.display = "none";
    document.getElementById('parent').style.display = "flex";  
})

//A new user joined
socket.on('user-joined',name => {
    append(`${name} joined the chat`,'center');
});

//A message is received
socket.on('received',data => {
    append(`${data.name} : ${data.message}`,'left');
});

//A user is disconnected
socket.on('disconnected', name => {
    append(`${name} has disconnected from the server!`,'center')
})