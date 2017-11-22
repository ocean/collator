// Methods for retreving the datas.
const employee = require("./retrieve/employee");
const employees = require("./retrieve/employees");
const manager = require("./retrieve/manager");
const team = require("./retrieve/team");

// Methods for inserting the datas.
const insert = require("./collection/insert");
const remove = require("./collection/remove");

module.exports = [].concat(insert, remove, employee, employees, manager, team);
