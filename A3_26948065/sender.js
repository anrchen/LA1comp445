'use strict';

var PORT = 33333;
var BROADCAST = '255.255.255.255';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var stdin = process.openStdin();

var isFirst = true;
var name = "Guest";

server.on('listening', function () {
    var address = server.address();
    //console.log('UDP Server listening on ' + address.address + ":" + address.port);
    console.log("Hello %s! Enter your name:",name);
});

server.on('message', function (message, remote) {
    var splitMsg = message.toString().split("\n");
    var sentName = splitMsg[0].split(":")[1];
    var sentMsg = splitMsg[1].split(":")[1];
    console.log("%s [%s]: %s", new Date(), sentName, sentMsg);
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
    } else {
        var message = "user:" + name + "\nmessage:" + d.toString().trim() + "\n\n";
        server.send(message, 0, message.length, PORT, BROADCAST);
    }
});