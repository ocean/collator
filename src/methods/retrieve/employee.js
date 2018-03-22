// import Bounce from 'bounce';
import connection from '../../config/database';

async function getEmployee(id) {
  try {
    const employee = await connection
      .table('employees')
      .filter({ userid: id.toUpperCase() })
      .nth(0)
      .run();

    return employee;
  } catch (error) {
    // Bounce.rethrow(error, 'boom');
    throw error;
  }
}

module.exports = {
  name: 'db.getEmployee',
  method: getEmployee,
  options: {},
};
