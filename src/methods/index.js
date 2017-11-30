// Methods for retreving the datas.
const employee = require("./retrieve/employee");
const employees = require("./retrieve/employees");
const manager = require("./retrieve/manager");
const team = require("./retrieve/team");

// Methods for inserting the datas.
const avatar = require("./avatars/insert");
const getAvatar = require("./avatars/get");
const missing = require("./avatars/missing");
const insert = require("./collection/insert");
const remove = require("./collection/remove");

module.exports = [].concat(
  getAvatar,
  missing,
  avatar,
  insert,
  remove,
  employee,
  employees,
  manager,
  team
);
