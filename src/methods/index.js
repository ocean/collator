// Methods for retreving a single document.
const employee = require("./retrieve/employee");
const manager = require("./retrieve/manager");
const team = require("./retrieve/team");

// Methods for retreving a collection of documents.
const employees = require("./collection/employees");
const surname = require("./collection/surname");

// Methods for inserting the datas.
const avatar = require("./avatars/insert");
const getAvatar = require("./avatars/get");
const missing = require("./avatars/missing");
const insert = require("./collection/insert");
const remove = require("./collection/remove");

// Methods for statistics
const stats = require("./statistics/stats");

module.exports = [].concat(
  avatar,
  employee,
  employees,
  getAvatar,
  insert,
  manager,
  missing,
  remove,
  stats,
  surname,
  team
);
