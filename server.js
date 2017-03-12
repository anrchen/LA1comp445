'use strict';

const net = require('net');
const yargs = require('yargs');

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
if (argv.v){
    verbose = true;
}

const server = net.createServer(handleClient)
    .on('error', err => {
      throw err
    });

server.listen({port: argv.p}, () => {
  console.log('Time server is listening at %j', server.address());
});

function handleClient(socket) {
  console.log('New client from %j', socket.address());
    socket
      .on('data', function (data) {
        console.log(data.toString());
    
        var splitHeader = data.toString().split("\n");
        var splitFirstLine = splitHeader[0].split(" ");
        
        var type = splitFirstLine[0];
        var requestedPage = splitFirstLine[1];
        
        if (type.toLowerCase() == "get") {
            if (requestedPage.toLowerCase() == "/"){
                console.log("print out dir");
                //TODO
            } else {
               console.log("return file if exists") 
               //TODO
            }
        } else if (type.toLowerCase() == "post"){
            if (requestedPage.toLowerCase() == "/"){
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
        socket.write(data.toString()+"HTTP/1.0 200 OK\r\nHEADER\r\n\r\nasdasdasdasasd");
        socket.destroy();
      })
      .on('error', err => {
        console.log('socket error %j', err);
        socket.destroy();
      });
}