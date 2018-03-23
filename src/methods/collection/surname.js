import connection from '../../config/database';

async function getEmployeesBySurname(filter) {
  const { letter, options } = filter;
  const employees = await connection
    .table('employees')
    .filter(doc => doc('surname').match(`^${letter}`))
    .skip(options.offset || 0)
    .limit(options.limit || 25)
    .run();

  const count = await connection
    .table('employees')
    .filter(doc => doc('surname').match(`^${letter}`))
    .count()
    .run();

  return { employees, count };
}

module.exports = {
  name: 'db.getEmployeesBySurname',
  method: getEmployeesBySurname,
  options: {},
};
