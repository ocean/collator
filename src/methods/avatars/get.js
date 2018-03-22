import connection from '../../config/database';

async function getAvatar(userid, next) {
  try {
    const employee = await connection
      .table('avatars')
      .filter({ userid: userid.toUpperCase() })
      .orderBy(connection.desc('taken'))
      .nth(0)
      .run();

    next(null, employee);
  } catch (error) {
    next(error);
  }
}

// server.method('db.getAvatar', getAvatar, {});

module.exports = {
  name: 'db.getAvatar',
  method: getAvatar,
  options: {},
};
