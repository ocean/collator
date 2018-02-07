const Crypto = require('crypto');

const strBuffer = Crypto.randomBytes(24);

console.log('Here is a 24 byte random token, converted to hex:');
console.log(strBuffer.toString('hex'));
