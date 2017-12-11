export default function statsHandler(request, reply) {
  request.server.methods.db.getStats((error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
