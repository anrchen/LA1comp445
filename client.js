'use strict';

const net = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node client.js [--host host] [--port port]')
    .default('host', 'httpbin.org')
    .default('port', 80)
    .default('path', '/status/418')
    .default('get', 1)
    .help('help')
    .argv;

const client = net.createConnection({host: argv.host, port: argv.port});

client.on('data', buf => {
  console.log("-----DATA RECEIVED BACK");
    console.log(buf.toString());
    console.log("-----DONE");
});

client.on('connect', () => {
    if(argv.get==1){
        client.write("GET "+argv.path+" HTTP/1.0 \n Host: "+argv.host+"\n\n");
    } else {
        client.write("POST /post HTTP/1.0\nHost: httpbin.org\ncontent-type: application/json\ncontent-length: 23\n\n{\"mapName\":\"myMapName\"}\n");
    }
});

client.on('error', err => {
  console.log('socket error %j', err);
  process.exit(-1);
});