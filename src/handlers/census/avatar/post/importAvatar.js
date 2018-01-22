import { decipher } from '../../../../utils/uploader';

export default async function importAvatar(request, reply) {
  try {
    // Get "Payload"
    const data = request.payload;
    const file = data.image;
    const userDetails = decipher(file.hapi.filename);
    request.server.methods.db.saveAvatar(
      file._data,
      file.hapi.filename,
      file.hapi.headers['content-type'],
      userDetails.userid,
      userDetails.date,
      (error, result) => {
        if (error) reply(error).code(500);
        return reply(result).code(200);
      }
    );
  } catch (error) {
    console.error(error);
    return reply(error).code(500);
  }
}
