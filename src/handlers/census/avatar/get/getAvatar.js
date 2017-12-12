import sharp from 'sharp';
import * as fs from 'fs';
import path from 'path';

const DEFAULT_AVATAR = path.join(__dirname, '../../../../data/avatar.jpg');

export default function getAvatar(request, reply) {
  const { employeeID } = request.params;
  const size = request.query.size ? parseInt(request.query.size) : null;

  request.server.methods.db.getAvatar(employeeID, (error, avatar) => {
    if (error) {
      fs.readFile(DEFAULT_AVATAR, (error, data) => reply(data)
        .header('Content-Disposition', 'inline')
        .header('Content-type', 'image/jpeg')
        .code(200));
    } else {
      const image = size
        ? sharp(avatar.file)
          .resize(size)
          .toBuffer()
        : avatar.file;

      return reply(image)
        .header('Content-Disposition', 'inline')
        .header('Content-type', avatar.mimetype)
        .code(200);
    }
  });
}
