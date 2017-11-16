import connection from "../../config/database";

export default async function getTeamHandler(req, reply) {
  const { id } = req.params;
  req.server.methods.db.getTeam(id, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
