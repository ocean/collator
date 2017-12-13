export default function orgHandler(request, reply) {
  request.server.methods.db.getOrganisation((error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
