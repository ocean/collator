import Fuse from 'fuse.js';
import connection from '../../../config/database';

const options = {
  shouldSort: true,
  tokenize: true,
  threshold: 0.1,
  location: 0,
  distance: 25,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'first_name',
    'preferred_name',
    'previous_surname',
    'surname',
    'userid',
  ],
};

export default async function searchHandler(request, reply) {
  const { q } = request.query;
  try {
    const employees = await connection.table('employees').run();
    const fuse = new Fuse(await employees, options);

    return reply(fuse
      .search(q)
      .slice(0, 25)
      .map(result => ['first_name', 'preferred_name', 'surname', 'userid'].reduce(
        (a, b) => ((a[b] = result[b]), a),
        {}
      ))).code(200);
  } catch (error) {
    reply(error).code(500);
  }
}
