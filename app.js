"use strict";
exports.__esModule = true;
var express = require("express");
var socket_io_1 = require("socket.io");
var handlebars = require("express-handlebars");
var findUser_1 = require("./helpers/findUser");
var app = express();
var server = app.listen(8081, function () { return console.log('RODANDO...'); });
var io = new socket_io_1.Server(server);
app.use(express.static("public"));
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({ dafaultLayout: false }));
var freechats = [];
io.on("connection", function (socket) {
    var user = socket.id;
    var myRoomID = findUser_1.findChat(freechats, socket, user, io);
    socket.on("message", function (message) {
        socket.broadcast.to(myRoomID).emit("newMessage", message);
    });
    socket.on("newTalk", function () {
        socket.leave(myRoomID);
        myRoomID = findUser_1.findChat(freechats, socket, user, io);
    });
    socket.on("quit", function () {
        io.to(myRoomID).emit('userLeft');
        socket.leave(myRoomID);
    });
    socket.on("disconnect", function () {
        io.to(myRoomID).emit('userLeft');
        if (freechats.includes(myRoomID)) {
            var roomIndex = freechats.indexOf(myRoomID);
            freechats.splice(roomIndex, roomIndex + 1);
        }
    });
});
app.get("/", function (req, res) {
    res.render("index");
});
