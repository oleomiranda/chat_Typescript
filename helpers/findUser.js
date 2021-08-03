"use strict";
exports.__esModule = true;
exports.findChat = void 0;
function findChat(freechats, socket, currentUser, io) {
    if (freechats.length > 0) {
        var roomID = freechats[Math.floor(Math.random() * freechats.length)];
        socket.join(roomID);
        var roomIDIndex = freechats.indexOf(roomID);
        freechats.splice(roomIDIndex, roomIDIndex + 1);
        io.to(roomID).emit('userConnected');
        return roomID;
    }
    else {
        var roomID = Math.floor(Math.floor(Math.random() * 1000)).toString();
        freechats.push(roomID);
        socket.join(roomID);
        return roomID;
    }
}
exports.findChat = findChat;
