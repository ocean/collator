import Crypto from 'crypto';

exports.generate = (input) => {
  const hash = Crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('base64');
};
