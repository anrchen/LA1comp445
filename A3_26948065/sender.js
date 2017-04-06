'use strict';

var PORT = 33333;
var BROADCAST = '255.255.255.255';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var stdin = process.openStdin();

var isFirst = true;
var name = "Guest";
var connectedUsers = [];

server.on('listening', function () {
    var address = server.address();
    //console.log('UDP Server listening on ' + address.address + ":" + address.port);
    console.log("Hello %s! Enter your name:", name);
});

server.on('message', function (message, remote) {
    var splitMsg = message.toString().split("\n");
    var sentName = splitMsg[0].split(":")[1];
    var sentCommand = splitMsg[1].split(":")[1];
    var sentMsg = splitMsg[2].split(":")[1];
    if (sentCommand === "TALK") {
        console.log("%s [%s]: %s", new Date(), sentName, sentMsg);
    } else if (sentCommand === "JOIN") {
        console.log("%s %s joined!", new Date(), sentName);
        if (name !== "Guest"){
                    sendMsg("", "PING");
        }
        if (!connectedUsers.contains(sentName)){
            connectedUsers.push(sentName);
        }
    } else if (sentCommand == "LEAVE") {
        console.log("%s %s left!", new Date(), sentName);
        connectedUsers.pop(sentName);
        if (sentName === name) {
            sendMsg("", "QUIT");
        }
    } else if (sentCommand == "PING") {
                if (!connectedUsers.contains(sentName)){
            connectedUsers.push(sentName);
        }
    }

    //console.log(remote.address + ':' + remote.port + ' - ' + message);

});

//server.bind();
server.bind(PORT, "", function () {
    server.setBroadcast(true);
});

stdin.addListener("data", function (d) {
    if (isFirst) {
        name = d.toString().trim();
        console.log("Welcome to the chat %s!", name);
        isFirst = false;
        sendMsg("", "JOIN");
    } else if (d.toString().trim().toLowerCase() === "/leave") {
        sendMsg("", "LEAVE");
    } else if (d.toString().trim().toLowerCase() === "/who") {
        sendMsg("", "WHO");
    } else {
        sendMsg(d, "TALK");
    }
});

function sendMsg(input, command) {
    if (command === "QUIT") {
        console.log("Bye Now!");
        process.exit(0);
    } else if (command === "WHO") {
        console.log("%s Connected Users: %s", new Date(), connectedUsers);
    } else {
        var message = "user:" + name + "\ncommand:" + command + "\nmessage:" + input.toString().trim() + "\n\n";
        server.send(message, 0, message.length, PORT, BROADCAST);
    }
}

Array.prototype.contains = function (needle) {
    for (var i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}