import connection from '../../config/database';

async function removeDocument(documentKey) {
  const remove = await connection
    .table('employees')
    .get(documentKey)
    .delete()
    .run();
  return remove;
}

module.exports = {
  name: 'db.removeDocument',
  method: removeDocument,
  options: {},
};
