import Boom from 'boom';

export default function getEmployee(request, reply) {
  const { employeeID } = request.params;
  request.server.methods.db.getEmployee(employeeID, (error, employee) => {
    if (error) {
      return reply(Boom.notFound(`No staff member found for user ID "${employeeID}"`));
    }
    return reply(employee).code(200);
  });
}
