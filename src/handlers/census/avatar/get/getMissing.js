export default function getMissing(request, h) {
  console.dir(request.server.methods);
  request.server.methods.db.getMissingAvatars((error, employee) => {
    if (error) return h.response(error).code(500);
    return h.response(employee).code(200);
  });
}
