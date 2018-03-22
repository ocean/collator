import connection from '../../config/database';

async function getEmployees() {
  try {
    const employees = await connection.table('employees').run();

    return employees;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  name: 'db.getEmployees',
  method: getEmployees,
  options: {},
};
