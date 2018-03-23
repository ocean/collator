import Boom from 'boom';
import { decipher } from '../../../../utils/uploader';

export default async function importAvatar(request, h) {
  try {
    // Get "Payload"
    const data = request.payload;
    const file = data.image;
    const userDetails = decipher(file.hapi.filename);
    const saveAvatar = await request.server.methods.db.saveAvatar(
      file._data,
      file.hapi.filename,
      file.hapi.headers['content-type'],
      userDetails.userid,
      userDetails.date,
    );
    return saveAvatar;
  } catch (error) {
    console.error(error);
    return h.response(Boom.badData('Unable to insert avatar image', error)).code(422);
  }
}
