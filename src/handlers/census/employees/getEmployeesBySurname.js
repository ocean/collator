export default function getEmployeesBySurname(request, reply) {
  const query = Object.assign({}, request.query);

  const { letter } = request.params;

  query.offset = (query.page - 1) * query.limit; // Add an offset value to the param object.
  const { page, pagination, ...options } = query;

  request.server.methods.db.getEmployeesBySurname(
    { letter, options },
    (error, response) => {
      if (error) reply(error).code(500);
      request.totalCount = response.count;
      return reply(response.employees).code(200);
    }
  );
}
