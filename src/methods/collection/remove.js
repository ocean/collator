import connection from '../../config/database';

async function removeDocument(documentKey, next) {
  try {
    const remove = await connection
      .table('employees')
      .get(documentKey)
      .delete()
      .run();
    // There is probably no error checking here...
    if (remove) next(null, remove);
    else next('error');
  } catch (error) {
    next(error);
  }
}

// server.method('db.removeDocument', removeDocument, {});

module.exports = {
  name: 'db.removeDocument',
  method: removeDocument,
  options: {},
};
