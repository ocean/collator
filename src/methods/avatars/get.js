import connection from '../../config/database';

module.exports.register = (server, options, next) => {
  async function getAvatar(userid, next) {
    try {
      const employee = await connection
        .table('avatars')
        .filter({ userid: userid.toUpperCase() })
        .nth(0)
        .run();

      next(null, employee);
    } catch (error) {
      next(error);
    }
  }

  server.method('db.getAvatar', getAvatar, {});

  next();
};

module.exports.register.attributes = {
  name: 'method.db.getAvatar',
};
