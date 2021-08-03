var socket = io();
var disconnectBtn = document.getElementById("disconnectbtn");
var chatForm = document.getElementById("chat-form");
var chatMessage = document.getElementById("chat-messages");
var messageInput = document.getElementById("msg");
chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var messageValue = messageInput.value;
    messageInput.value = "";
    var userName = "Você";
    formatMessage(messageValue, userName);
    socket.emit("message", messageValue);
});
disconnectBtn.addEventListener("click", function () {
    socket.emit("quit");
});
socket.on("userConnected", function () {
    userConnected();
});
socket.on("newMessage", function (messageValue) {
    var userName = "Estranho";
    formatMessage(messageValue, userName);
});
socket.on("userLeft", function () {
    userLeftWarning();
});
function userConnected() {
    var p = document.createElement('p'); //cria paragrafo
    p.innerHTML = "<b>Voc\u00EA est\u00E1 conversando com algu\u00E9m. Diga oi</b>"; //adiciona texto ao paragrafo
    chatMessage.appendChild(p); // adiciona o paragrafo na div de mensagens 
    setTimeout(function () {
        chatMessage.removeChild(chatMessage.firstChild); //timeout para remover o paragrafo apos 2seg 
    }, 2400);
}
function userLeftWarning() {
    var p = document.createElement('p'); // cria paragrafo 
    p.innerHTML = "<b>O usu\u00E1rio saiu da sala</b>"; //adiciona texto ao paragrafo 
    var btn = document.createElement('button'); //cria um botao 
    btn.setAttribute('id', 'newTalk'); // adiciona id ao botao 
    btn.textContent = "Nova conversa"; // adiciona texto ao botao 
    btn.addEventListener("click", function () {
        chatMessage.innerHTML = ""; // Apaga as mensagens ateriores do chat 
        socket.emit("newTalk"); // emit o event do socket para achar ou criar novo chat 
    });
    chatMessage.appendChild(p); // adiciona o paragrafo na div de mensagens 
    chatMessage.appendChild(btn); //adiciona o botao na div de mensagens 
}
function formatMessage(message, userName) {
    var div = document.createElement("div"); //CRIA div 
    div.innerHTML = "<p><b>" + userName + "</b>: " + message + "</p>"; // Adiciona a menssagem na div 
    chatMessage.appendChild(div); // adiciona a nova div na div de mensagens 
    chatMessage.scrollTop = chatMessage.scrollHeight;
}
