import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export function findChat(freechats: Array<string>, socket: Socket<DefaultEventsMap>, currentUser: string, io: Server<DefaultEventsMap>): string {
	if (freechats.length > 0) {
		let roomID = freechats[Math.floor(Math.random() * freechats.length)]
		socket.join(roomID)
		let roomIDIndex = freechats.indexOf(roomID)
		freechats.splice(roomIDIndex, roomIDIndex + 1)
		io.to(roomID).emit('userConnected')
		return roomID

	} else {
		let roomID = Math.floor(Math.floor(Math.random() * 1000)).toString()
		freechats.push(roomID)
		socket.join(roomID)
		return roomID
	}
}

