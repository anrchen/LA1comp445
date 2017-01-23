'use strict';

const net = require('net');
const yargs = require('yargs');

const argv = yargs.usage('node client.js [--host host] [--port port]')
    .default('host', 'httpbin.org')
    .default('port', 80)
    .help('help')
    .argv;

const client = net.createConnection({host: argv.host, port: argv.port});

const requests = [];

client.on('data', buf => {
  console.log("test");
  if (requests.length == 0) {
    console.log("test1");
    client.end();
    process.exit(-1);
  }

  const r = requests[0];
  r.response = Buffer.concat([r.response, buf]);

  if(r.response.byteLength >= r.sendLength){
    requests.shift();
    console.log("Replied: " + r.response.toString("utf-8"))
  }
});

client.on('connect', () => {
  console.log('Type any thing then ENTER. Press Ctrl+C to terminate');

  process.stdin.on('readable', () => {
    console.log("test2");
    const chunk =  process.stdin.read();
    if (chunk != null) {
      requests.push({
        sendLength: chunk.byteLength,
        response: new Buffer(0)
      });
      client.write(chunk);
    }
  });
});

client.on('error', err => {
  console.log('socket error %j', err);
  process.exit(-1);
});
