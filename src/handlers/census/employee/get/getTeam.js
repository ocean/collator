import Boom from 'boom';

export default async function getTeam(request, h) {
  const { employeeID } = request.params;
  const team = await request.server.methods.db.getTeam(employeeID);
  try {
    return team;
  } catch (error) {
    return h.response(Boom.notFound(`No team found for user ID "${employeeID}"`)).code(404);
  }
}
