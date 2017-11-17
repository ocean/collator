export default function getTeamHandler(request, reply) {
  const { id } = request.params;
  request.server.methods.db.getTeam(id, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
