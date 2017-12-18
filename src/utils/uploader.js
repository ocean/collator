import * as uuid from 'uuid';
import * as fs from 'fs';
import split from 'lodash/split';
import moment from 'moment';


const csvFilter = (fileName) => {
  if (!fileName.match(/\.(csv)$/)) {
    return false;
  }
  return true;
};

const jpgFilter = (fileName) => {
  if (!fileName.match(/\.(jpg)$/)) {
    return false;
  }
  return true;
};

// Lots of assumptions here!
// Filename needs to be userid_date.jpg
// E.g. AAlain_20170420.jpg

const decipher = (string) => {
  const explode = split(string.replace(/\.[^/.]+$/, ''), '_');
  const userid = explode[0].toUpperCase();
  const date = moment(explode[1]).format();

  return { userid, date };
};

const _fileHandler = (file, options) => { // eslint-disable-line
  if (!file) throw new Error('No file. Please upload the required file. yo.');

  const originalName = file.hapi.filename;
  const path = `${options.dest}${file.hapi.filename}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on('error', err => reject(err));
    file.pipe(fileStream);
    file.on('end', (err) => {
      const fileDetails = {
        fieldName: file.hapi.name,
        originalName: file.hapi.filename,
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path,
        size: fs.statSync(path).size,
      };

      resolve(fileDetails);
    });
  });
};

const uploader = (file, options) => {
  if (!file) throw new Error('No file. Please upload the required file. yo.');
  return _fileHandler(file, options);
};

export { csvFilter, decipher, uploader };
