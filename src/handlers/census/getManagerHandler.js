export default function getManagerHandler(request, reply) {
  const { id } = request.params;
  request.server.methods.db.getManager(id, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
