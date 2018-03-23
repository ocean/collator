import Boom from 'boom';

export default async function getEmployee(request) {
  const { employeeID } = request.params;
  try {
    const employee = await request.server.methods.db.getEmployee(employeeID);
    return employee;
  } catch (error) {
    return Boom.notFound(`No staff member found for user ID '${employeeID}'`, error, { statusCode: 404 });
  }
}
