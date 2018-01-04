import differenceWith from 'lodash/differenceWith';
import connection from '../../config/database';

module.exports.register = (server, options, next) => {
  async function getMissingAvatars(next) {
    try {
      const avatars = await connection
        .table('avatars')
        .withFields('userid')
        .run();
      const employees = await connection
        .table('employees')
        .withFields('userid', 'display_name')
        .run();
      const missing = differenceWith(await avatars, await employees, (a, b) => a.userid === b.userid);
      return next(null, missing);
    } catch (error) {
      next(error);
    }
  }

  server.method('db.getMissingAvatars', getMissingAvatars, {});

  next();
};

module.exports.register.attributes = {
  name: 'method.db.getMissingAvatars',
};
