const socket = io()
const disconnectBtn = document.getElementById("disconnectbtn")
const chatForm = document.getElementById("chat-form")
const chatMessage = document.getElementById("chat-messages")
const messageInput = (<HTMLInputElement>document.getElementById("msg"))



chatForm.addEventListener("submit", event => {
	event.preventDefault()
	let messageValue = messageInput.value
	messageInput.value = ""
	let userName = "Você";
	formatMessage(messageValue, userName)
	socket.emit("message", messageValue)
})

disconnectBtn.addEventListener("click", () => {
	socket.emit("quit")
})



socket.on("userConnected", () => {
	userConnected()
})

socket.on("newMessage", messageValue => {
	let userName = "Estranho";
	formatMessage(messageValue, userName)
})

socket.on("userLeft", () => {
	userLeftWarning()
})



function userConnected(){
	let p = document.createElement('p') //cria paragrafo
	p.innerHTML = `<b>Você está conversando com alguém. Diga oi</b>` //adiciona texto ao paragrafo
	chatMessage.appendChild(p) // adiciona o paragrafo na div de mensagens 
	setTimeout(() => {
		chatMessage.removeChild(chatMessage.firstChild) //timeout para remover o paragrafo apos 2seg 
	}, 2400);
}
 

function userLeftWarning(){
	let p = document.createElement('p') // cria paragrafo 
	p.innerHTML = `<b>O usuário saiu da sala</b>` //adiciona texto ao paragrafo 
	let btn = document.createElement('button') //cria um botao 
	btn.setAttribute('id', 'newTalk') // adiciona id ao botao 
	btn.textContent = "Nova conversa" // adiciona texto ao botao 
	btn.addEventListener("click", () => { // adiciona eventListener ao botao 
		chatMessage.innerHTML = "" // Apaga as mensagens ateriores do chat 
		socket.emit("newTalk") // emit o event do socket para achar ou criar novo chat 
	})
	chatMessage.appendChild(p) // adiciona o paragrafo na div de mensagens 
	chatMessage.appendChild(btn) //adiciona o botao na div de mensagens 

}


function formatMessage(message: string, userName: string){
	let div = document.createElement("div") //CRIA div 
	div.innerHTML = `<p><b>${userName}</b>: ${message}</p>`// Adiciona a menssagem na div 
	chatMessage.appendChild(div) // adiciona a nova div na div de mensagens 
	chatMessage.scrollTop = chatMessage.scrollHeight
}
