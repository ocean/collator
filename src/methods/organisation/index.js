import _ from 'lodash';
import connection from '../../config/database';

async function getOrganisation() {
  const structure = {};

  const organisation = await connection
    .table('employees')
    .filter(doc => doc('div').ne(''))
    .pluck('grp', 'div', 'directorate', 'bran', 'sect', 'team');

  const filtered = Array.from(new Set(organisation.map(JSON.stringify))).map(JSON.parse);

  filtered.map((obj) => {
    _.merge(structure, { [obj.grp]: { [obj.div]: { [obj.directorate]: { [obj.bran]: [] } } } });
    structure[obj.grp][obj.div][obj.directorate][obj.bran].push(obj.sect);
  });

  return structure;
}

module.exports = {
  name: 'db.getOrganisation',
  method: getOrganisation,
  options: {},
};
