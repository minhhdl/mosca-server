const http = require('http');
var MOSCA_PORT  = process.env.MOSCA_PORT || 1883;
var mosca = require('mosca');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Mosca Server - Develope by Minh Huynh\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var broker = new mosca.Server({
  port: MOSCA_PORT
});

var ws = broker.attachHttpServer(server);

broker.on('ready', function(){
  console.log('Mosca server ready!')
});

broker.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack)
});

broker.on('published', function (packet, client) {
  if (client) {
    console.log('message from client', client.id);
    if(packet.payload.toString() == 'Request Status') {
      broker.publish(
        {
          topic: 'smartControl', 
          payload: '1011'
        }
      )
    }
  }
});

broker.on('unsubscribed', function() {
  console.log('hi')
});


broker.on('clientDisconnected', function (client) {
  console.log('client disconnet', client.id)
});

broker.on('clientConnected', function (client) {
  console.log('client connect', client.id)
});