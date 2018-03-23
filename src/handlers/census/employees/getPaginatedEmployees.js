export default async function getPaginatedEmployees(request) {
  const params = Object.assign({}, request.query);
  params.offset = (params.page - 1) * params.limit; // Add an offset value to the param object.
  const { page, pagination, ...filter } = params;
  const response = await request.server.methods.db.getPaginatedEmployees(filter);
  request.totalCount = response.count;
  return response.employees;
}
