// Methods for retreving the datas.
const employee = require('./retrieve/employee');
const employees = require('./retrieve/employees');
const manager = require('./retrieve/manager');
const team = require('./retrieve/team');

// Methods for inserting the datas.
const collection = require('./insert/collection');

module.exports = [].concat(collection, employee, employees, manager, team);