import Fuse from "fuse.js";

const options = {
  shouldSort: true,
  tokenize: true,
  threshold: 0.1,
  location: 0,
  distance: 25,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    "first_name",
    "preferred_name",
    "previous_surname",
    "surname",
    "userid"
  ]
};

export default function searchHandler(request, reply) {
  const { q } = request.query;
  request.server.methods.db.getEmployees((error, employees) => {
    if (q) {
      const fuse = new Fuse(employees, options);
      return reply(fuse.search(q)).code(200);
    }
    if (error) reply(error).code(500);
    return reply('A message about how you\'ve messed up');
  });
}
