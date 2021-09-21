/* eslint-disable-next-line */
const fs = require('fs');

const DECODED_FILE = './data/songs_decoded.xml';
const ENCODED_FILE = './data/songs.db';

class Encoder {
  static encode() {
    const fileData = fs.readFileSync(DECODED_FILE, 'utf8');
    let buff = Buffer.from(fileData);
    fs.writeFileSync(ENCODED_FILE, buff.toString('base64'));
  }
  static decode() {
    const fileData = fs.readFileSync(ENCODED_FILE, 'utf8');
    let buff = Buffer.from(fileData, 'base64');
    fs.writeFileSync(DECODED_FILE, buff.toString('utf8'));
  }
}

if (require.main === module) {
  if (process.argv.includes('encode')) {
    Encoder.encode();
  } else if (process.argv.includes('decode')) {
    Encoder.decode();
  }
}
