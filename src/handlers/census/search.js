import { getManager, getTeam } from '../../config/database/employee';

export default async function searchEmployees(request, reply) {
  try {
    return reply(await getTeam('CJEFTOS'));
  } catch (error) {
    return reply(error);
  }
  
  // const options = {
  //   shouldSort: true,
  //   tokenize: true,
  //   threshold: 0.1,
  //   location: 0,
  //   distance: 25,
  //   maxPatternLength: 32,
  //   minMatchCharLength: 3,
  //   keys: [
  //     "first_name",
  //     "preferred_name",
  //     "previous_surname",
  //     "surname",
  //     "userid",
  //   ],
  // };
  
  // request.server.methods.db.search((err, staff) => {
  //   return staff.toArray((err, results) => {
  //     if (request.query.q) {
  //       const fuse = new Fuse(results, options);
  //       reply(fuse.search(request.query.q));
  //     }
  //   });
  // });
}
