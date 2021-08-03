import * as express from "express";
import { Server, Socket } from "socket.io"
import * as handlebars from "express-handlebars"
import { findChat } from "./helpers/findUser"

const app = express()
const server = app.listen(8081, () => console.log('RODANDO...'))
const io = new Server(server)

app.use(express.static("public"))
app.set("view engine", "handlebars")
app.engine("handlebars", handlebars({ dafaultLayout: false }))


var freechats: Array<string> = []

io.on("connection",  (socket: Socket)=> {

	const user = socket.id
	var myRoomID =  findChat(freechats, socket, user, io)

	socket.on("message", (message: string)=> {
		socket.broadcast.to(myRoomID).emit("newMessage", message)
	})



	socket.on("newTalk",  () => {
		socket.leave(myRoomID)
		myRoomID =  findChat(freechats, socket, user, io)
	})



	socket.on("quit", () => {
		io.to(myRoomID).emit('userLeft')
		socket.leave(myRoomID)
	})


	
	socket.on("disconnect", () => {
		io.to(myRoomID).emit('userLeft')
		if(freechats.includes(myRoomID)){
			let roomIndex = freechats.indexOf(myRoomID)
			freechats.splice(roomIndex, roomIndex+1)
		}
	})
		

})

app.get("/", function (req: express.Request, res: express.Response) {
	res.render("index")
})

