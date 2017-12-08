export default function getEmployees(request, reply) {
  const params = Object.assign({}, request.query);
  params.offset = (params.page - 1) * params.limit; // Add an offset value to the param object.
  const { page, pagination, ...filter } = params;
  request.server.methods.db.getEmployees(filter, (error, response) => {
    if (error) reply(error).code(500);
    request.totalCount = response.count;
    return reply(response.employees).code(200);
  });
}
