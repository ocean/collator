import differenceWith from 'lodash/differenceWith';
import connection from '../../config/database';

async function getMissingAvatars() {
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
    return missing;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  name: 'db.getMissingAvatars',
  method: getMissingAvatars,
  options: {},
};
