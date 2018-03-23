import connection from '../../config/database';

async function insertCollection(collection) {
  const insert = await connection
    .table('employees')
    .insert(collection, { returnChanges: true, conflict: 'replace' })
    .run();
  return insert;
}

module.exports = {
  name: 'db.insertCollection',
  method: insertCollection,
  options: {},
};
