'use strict';

const net = require('net');
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const argv = yargs.usage('httpfs [-v] [-p PORT] [-d PATH-TO-DIR]')
    .describe('v', 'Prints debugging messages.')
    .default('p', 8080)
    .describe('p', 'Specifies the port number that the server will listen and serve at.')
    .default('d', "/")
    .describe('d', 'Specifies the directory that the server will use to read/write requested files. Default is the current directory when launching the application.')
    .help('help')
    .argv;

//set verbose
var verbose = false;
if (argv.v) {
    verbose = true;
}

const server = net.createServer(handleClient)
    .on('error', err => {
        throw err
    });

server.listen({
    port: argv.p
}, () => {
    console.log('Server is listening at %j', server.address());
});

function handleClient(socket) {
    console.log('New client from %j', socket.address());
    socket
        .on('data', function (data) {
            if (verbose) console.log(data.toString());

            var splitHeader = data.toString().split("\n");
            var splitFirstLine = splitHeader[0].split(" ");

            //get the type; get or post
            var type = splitFirstLine[0];

            //get the requested page path
            var requestedPage = splitFirstLine[1];

            var errorCode = "200 OK";
            var dataToWrite = "";

            if (type.toLowerCase() == "get") {
                if (requestedPage.toLowerCase() == "/") {
                    dataToWrite = "Current list of files in the data directory:";
                    var files = fs.readdirSync(argv.d);
                    for (var i in files) {
                        dataToWrite = dataToWrite + "\n" + files[i];
                    }
                    if (verbose) console.log(dataToWrite);
                } else {
                    //if requested a particular file
                    //for security only accept the file name
                    var file = argv.d + "/" + path.basename(requestedPage);
                    if (verbose) console.log(file);
                    try {
                        var fileContent = fs.readFileSync(file);
                        dataToWrite = fileContent.toString();
                    } catch (err) {
                        dataToWrite = "Error: File not found";
                        errorCode = "404 Not Found";
                        if (verbose) console.log("File not found");
                    }
                }
            } else if (type.toLowerCase() == "post") {
                if (requestedPage.toLowerCase() == "/") {
                    console.log("error cant post to root");
                    //TODO
                } else {
                    console.log("create or overwrite the file named");
                    //TODO
                }


            } else {
                console.log("error");
                //TODO
            }


            // just echo what received
            //data.toString()
            //
            socket.write("HTTP/1.0 "+errorCode+"\r\n\r\n" + dataToWrite);
            socket.destroy();
        })
        .on('error', err => {
            console.log('socket error %j', err);
            socket.destroy();
        });
}