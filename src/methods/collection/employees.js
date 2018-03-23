import connection from '../../config/database';

async function getEmployees() {
  const employees = await connection.table('employees').run();
  return employees;
}

module.exports = {
  name: 'db.getEmployees',
  method: getEmployees,
  options: {},
};
