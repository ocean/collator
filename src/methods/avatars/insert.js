import connection from '../../config/database';
// import * as fs from 'fs';

async function saveAvatar(fileBuffer, fileName, mimetype, userID, dateTaken) {
  const insert = await connection
    .table('avatars')
    .insert({
      userid: userID,
      filename: fileName,
      mimetype,
      file: fileBuffer,
      taken: dateTaken,
    }, { conflict: 'replace' })
    .run();
  // There is probably no error checking here...
  return insert;
}

module.exports = {
  name: 'db.saveAvatar',
  method: saveAvatar,
  options: {},
};
