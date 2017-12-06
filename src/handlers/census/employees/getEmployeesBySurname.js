export default function getEmployeesBySurname(request, reply) {
  const { letter } = request.params;
  request.server.methods.db.getEmployeesBySurname(letter, (error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
