import connection from "../../config/database";

export default async function getManagerHandler(req, reply) {
  const { id } = req.params;
  req.server.methods.db.getManager(id, (error, employee) => {
    console.log(error);
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
