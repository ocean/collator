import connection from '../../config/database';

async function getAvatar(userid) {
  const avatar = await connection
    .table('avatars')
    .filter({ userid: userid.toUpperCase() })
    .orderBy(connection.desc('taken'))
    .nth(0)
    .run();
  return avatar;
}

module.exports = {
  name: 'db.getAvatar',
  method: getAvatar,
  options: {},
};
