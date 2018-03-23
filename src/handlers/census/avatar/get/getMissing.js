export default async function getMissing(request) {
  const response = await request.server.methods.db.getMissingAvatars();
  return response;
}
