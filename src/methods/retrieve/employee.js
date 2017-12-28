import connection from '../../config/database';

module.exports.register = (server, options, next) => {
  async function getEmployee(id, next) {
    try {
      const employee = await connection
        .table('employees')
        .filter({ userid: id.toUpperCase() })
        .nth(0)
        .run();

      if (employee) next(null, employee);
      else next('error');
    } catch (error) {
      next(error);
    }
  }

  server.method('db.getEmployee', getEmployee, {});

  next();
};

module.exports.register.attributes = {
  name: 'method.db.getEmployee',
};
