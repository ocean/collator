import connection from '../../config/database';

async function getManager(id) {
  try {
    const manager = await connection
      .table('employees')
      .filter({ userid: id.toUpperCase() })
      .innerJoin(connection.table('employees'), (user, supervisor) => user('supervisor_userid').eq(supervisor('userid')))
      .zip()
      .nth(0)
      .run();

    return manager;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  name: 'db.getManager',
  method: getManager,
  options: {},
};
