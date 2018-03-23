import connection from '../../config/database';

async function getEmployee(id) {
  const employee = await connection
    .table('employees')
    .filter({ userid: id.toUpperCase() })
    .nth(0)
    .run();
  return employee;
}

module.exports = {
  name: 'db.getEmployee',
  method: getEmployee,
  options: {},
};
