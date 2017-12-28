export default function getEmployees(request, reply) {
  request.server.methods.db.getEmployees((error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
