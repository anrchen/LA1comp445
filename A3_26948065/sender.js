'use strict';

var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var isFirst = true;
var name = "Guest";

server.on('listening', function () {
    var address = server.address();
    //console.log('UDP Server listening on ' + address.address + ":" + address.port);
    console.log("Enter your name:");
});

server.on('message', function (message, remote) {
    var splitMsg = message.toString().split("\n");
    var sentName = splitMsg[0].split(":")[1];
    var sentMsg = splitMsg[1].split(":")[1];
    console.log("%s [%s]: %s",new Date(),sentName,sentMsg);
    //console.log(remote.address + ':' + remote.port + ' - ' + message);

});

server.bind(PORT, HOST);

var stdin = process.openStdin();

stdin.addListener("data", function (d) {
    if (isFirst){
        name = d.toString().trim();
        console.log("Welcome to the chat %s!",name);
        isFirst = false;
    } else {
    var message = "user:"+name+"\nmessage:"+d.toString().trim()+"\n\n";
    server.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        //console.log('UDP message sent to ' + HOST + ':' + PORT);
    });
    }
});