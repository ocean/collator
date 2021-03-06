import connection from '../../config/database';

module.exports.register = (server, options, next) => {
  async function getStats(next) {
    try {
      const groups = await connection
        .table('employees')
        .filter(doc => doc('grp').ne(''))('grp')
        .distinct()
        .count();

      const divisions = await connection
        .table('employees')
        .filter(doc => doc('div').ne(''))('div')
        .distinct()
        .count();

      const directorates = await connection
        .table('employees')
        .filter(doc => doc('directorate').ne(''))('directorate')
        .distinct()
        .count();

      const branches = await connection
        .table('employees')
        .filter(doc => doc('bran').ne(''))('bran')
        .distinct()
        .count();

      const sections = await connection
        .table('employees')
        .filter(doc => doc('sect').ne(''))('sect')
        .distinct()
        .count();

      const teams = await connection
        .table('employees')
        .filter(doc => doc('team').ne(''))('team')
        .distinct()
        .count();

      const employees = await connection
        .table('employees')
        .filter(doc => doc('email').ne(''))('email')
        .distinct()
        .count();

      const locations = await connection
        .table('employees')
        .filter(doc => doc('location_name').ne(''))('location_name')
        .distinct()
        .count();

      const stats = {
        organisation: {
          groups,
          divisions,
          directorates,
          branches,
          sections,
          teams,
        },
        employees,
        locations,
      };

      return next(null, stats);
    } catch (error) {
      return next(error);
    }
  }

  server.method('db.getStats', getStats, {});

  next();
};

module.exports.register.attributes = {
  name: 'method.db.getStats',
};
