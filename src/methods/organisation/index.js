import _ from 'lodash';
import connection from '../../config/database';

module.exports.register = (server, options, next) => {
  async function getOrganisation(next) {
    try {
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

      return next(null, structure);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  server.method('db.getOrganisation', getOrganisation, {});

  next();
};

module.exports.register.attributes = {
  name: 'method.db.getOrganisation',
};
