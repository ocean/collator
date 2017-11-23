export default function getMissing(request, reply) {
  request.server.methods.db.getMissingAvatars((error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
