import connection from '../../config/database';

// AIAM? check for manager status....
async function managerCheck(id) {
  const status = await connection
    .table('employees')
    .filter({ supervisor_userid: id.toUpperCase() })
    .count();
  return await status > 0;
}

async function getTeam(id) {
  try {
    const field = await managerCheck(id) ? 'userid' : 'supervisor_userid';
    const team = await connection
      .table('employees')
      .filter({ userid: id.toUpperCase() }) // Find requested employee.
      .innerJoin(
        connection
          .table('employees')
          // Filter out any employees on "Secondment". This is from a combination
          // of "actingOrHDAFlag" and "HDA_termination_date".
          .filter(document =>
            connection
              .and(document('actingOrHDAFlag').eq('N'))
              .and(document('HDA_termination_date').ne(''))
              .not())
          // Filter out the requested employee from the team.
          .filter(document =>
            connection
              .expr([id.toUpperCase()])
              .contains(document('userid'))
              .not()),
        (staff, team) =>

          // Equvilent of a self join to return all employees with the same "Manager"
          staff(field).eq(team('supervisor_userid'))

      )
      .zip()
      .orderBy('surname')
      .run();
    return team;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  name: 'db.getTeam',
  method: getTeam,
  options: {},
};
