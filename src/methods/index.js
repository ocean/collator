const employees = require('./db/all');
const employee = require('./db/employee');
const manager = require('./db/manager');
const team = require('./db/team');

module.exports = [].concat(employees, employee, manager, team);