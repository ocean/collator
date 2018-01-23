import Fuse from 'fuse.js';
import _ from 'lodash';
import connection from '../../../config/database';
// import { remover } from '../../../utils/acronym-remover';

const options = {
  shouldSort: true,
  tokenize: true,
  threshold: 0.1,
  location: 0,
  distance: 25,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'div',
    'directorate',
    'bran',
    'sect',
    'team',
    'grp',
  ],
};

export default async function searchBusinessUnits(request, reply) {
  const { q } = request.query;
  try {
    const employees = await connection.table('employees').run();
    const fuse = new Fuse(await employees, options);

    const fullResults = fuse
      .search(q)
      .slice(0, 25)
      .map(result => ['div', 'directorate', 'bran', 'sect', 'team', 'grp']
        .reduce((a, b) => ((a[b] = result[b]), a),
          {}
        ));
    const results = _.uniqWith(fullResults, _.isEqual);
    return reply(results).code(200);
  } catch (error) {
    return reply(error).code(500);
  }
}
