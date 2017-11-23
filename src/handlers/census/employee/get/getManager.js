export default function getManager(request, reply) {
  const { employeeID } = request.params;
  request.server.methods.db.getManager(employeeID, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
