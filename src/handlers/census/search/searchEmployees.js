import Fuse from 'fuse.js';
import sortBy from 'lodash/sortBy';
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
    // {
    //   name: 'first_name',
    //   weight: 0.5,
    // },
    {
      name: 'preferred_name',
      weight: 1,
    },
    {
      name: 'previous_surname',
      weight: 0.6,
    },
    {
      name: 'surname',
      weight: 1,
    },
    {
      name: 'userid',
      weight: 0.4,
    },
  ],
};

export default async function searchEmployees(request, reply) {
  const { q } = request.query;
  try {
    const employees = await connection.table('employees').run();
    const fuse = new Fuse(await employees, options);

    const fullResults = fuse
      .search(q)
      .slice(0, 60)
      .map(result => ['first_name', 'preferred_name', 'surname', 'phone', 'position_title', 'userid', 'grp', 'div', 'directorate', 'bran', 'sect', 'location_name', 'sublocation_name']
        .reduce(
          (a, b) => ((a[b] = result[b]), a),
          {}
        ));
    const results = sortBy(fullResults, ['surname', 'preferred_name']);
    return reply(results).code(200);
    // return reply(fullResults).code(200);
  } catch (error) {
    return reply(error).code(500);
  }
}
