import sharp from "sharp";

export default function getAvatar(request, reply) {
  const { employeeID } = request.params;
  const size = request.query.size ? parseInt(request.query.size) : null;
  request.server.methods.db.getAvatar(employeeID, (error, avatar) => {
    if (error) return reply("broken").code(200);
    const image = size
      ? sharp(avatar.file)
          .resize(size)
          .toBuffer()
      : avatar.file;
    return reply(image)
      .header("Content-Disposition", "inline")
      .header("Content-type", avatar.mimetype)
      .code(200);
  });
}
