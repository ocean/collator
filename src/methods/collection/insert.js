import connection from '../../config/database';

async function insertCollection(collection) {
  try {
    const insert = await connection
      .table('employees')
      .insert(collection, { returnChanges: true, conflict: 'replace' })
      .run();
    // There is probably no error checking here...
    return insert;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  name: 'db.insertCollection',
  method: insertCollection,
  options: {},
};
