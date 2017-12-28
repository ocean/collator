export default function getEmployee(request, reply) {
  const { employeeID } = request.params;
  request.server.methods.db.getEmployee(employeeID, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
