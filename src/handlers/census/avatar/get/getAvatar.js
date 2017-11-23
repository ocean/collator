export default function getAvatar(request, reply) {
  const { employeeID } = request.params;
  request.server.methods.db.getAvatar(employeeID, (error, avatar) => {
    if (error) return reply("broken").code(200);

    return reply(avatar.file)
      .header("Content-Disposition", "inline")
      .header("Content-type", avatar.mimetype)
      .code(200);
  });
}
