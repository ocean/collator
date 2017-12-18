// Methods for retreving a single document.
const employee = require('./retrieve/employee');
const manager = require('./retrieve/manager');
const team = require('./retrieve/team');

// Methods for retreving a collection of documents.
const employees = require('./collection/employees');
const paginated = require('./collection/paginated');
const surname = require('./collection/surname');

// Methods for inserting the datas.
const avatar = require('./avatars/insert');
const getAvatar = require('./avatars/get');
const missing = require('./avatars/missing');
const insert = require('./collection/insert');
const remove = require('./collection/remove');

// Statistics Methods
const stats = require('./statistics');

// Organisation Methods
const organisation = require('./organisation');

module.exports = [].concat(
  avatar,
  employee,
  employees,
  getAvatar,
  insert,
  manager,
  missing,
  organisation,
  paginated,
  remove,
  stats,
  surname,
  team
);
