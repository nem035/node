'use strict';
const common = require('../common');
const dgram = require('dgram');

const source = dgram.createSocket('udp4');
const target = dgram.createSocket('udp4');
let messages = 0;

target.on('message', common.mustCall(function(buf) {
  if (buf.toString() === 'abc') ++messages;
  if (buf.toString() === 'def') ++messages;
  if (messages === 2) {
    source.close();
    target.close();
  }
}, 2));

target.on('listening', function() {
  // Second .send() call should not throw a bind error.
  const port = this.address().port;
  source.send(Buffer.from('abc'), 0, 3, port, '127.0.0.1');
  source.send(Buffer.from('def'), 0, 3, port, '127.0.0.1');
});

target.bind(0);
