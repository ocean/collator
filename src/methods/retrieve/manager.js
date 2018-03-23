import connection from '../../config/database';

async function getManager(id) {
  const manager = await connection
    .table('employees')
    .filter({ userid: id.toUpperCase() })
    .innerJoin(connection.table('employees'), (user, supervisor) => user('supervisor_userid').eq(supervisor('userid')))
    .zip()
    .nth(0)
    .run();

  return manager;
}

module.exports = {
  name: 'db.getManager',
  method: getManager,
  options: {},
};
