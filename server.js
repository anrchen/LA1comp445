'use strict';

const net = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node timeserver.js [--port port]')
    .default('port', 8037)
    .help('help')
    .argv;

const server = net.createServer(handleClient)
    .on('error', err => {
      throw err
    });

server.listen({port: argv.port}, () => {
  console.log('Time server is listening at %j', server.address());
});

function handleClient(socket) {
  console.log('New client from %j', socket.address());
    socket
      .on('data', buf => {
        // just echo what received
        socket.write("asdasdasdasasd");
        socket.destroy();
      })
      .on('error', err => {
        console.log('socket error %j', err);
        socket.destroy();
      })
      .on('end', () => {
        socket.destroy();
      });
}