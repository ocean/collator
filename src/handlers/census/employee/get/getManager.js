export default async function getManager(request, h) {
  const { employeeID } = request.params;
  const employee = await request.server.methods.db.getManager(employeeID);
  try {
    return h.response(employee).code(200);
  } catch (error) {
    throw error;
  }
}
