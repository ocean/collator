import Boom from 'boom';
// import Bounce from 'bounce';

export default async function getEmployee(request, h) {
  const { employeeID } = request.params;
  const employee = await request.server.methods.db.getEmployee(employeeID);
  try {
    return h.response(employee).code(200);
  } catch (error) {
    // Bounce.rethrow(error, 'boom');
    return h.response(Boom.notFound(`No staff member found for user ID "${employeeID}"`)).code(404);
  }
  // return employee;
}
