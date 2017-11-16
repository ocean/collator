import connection from "../../config/database";

export default async function getEmployeeHandler(req, reply) {
  const { id } = req.params;
  req.server.methods.db.getEmployee(id, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
