import { getAvatar, getMissing, importAvatar } from '../../handlers/census/avatar';
import { getEmployee, getManager, getTeam, importEmployee } from '../../handlers/census/employee';
import { searchHandler } from '../../handlers/census/search';

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: "POST",
      path: "/api/v1/census/employees/import",
      config: {
        payload: {
          output: "stream",
          allow: "multipart/form-data"
        }
      },
      handler: importEmployee
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/search",
      handler: searchHandler,
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}",
      handler: getEmployee
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/manager",
      handler: getManager
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/team",
      handler: getTeam
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/avatar",
      handler: getAvatar
    },
    {
      method: "GET",
      path: "/api/v1/census/avatar/missing",
      handler: getMissing
    },
    {
      method: "POST",
      path: "/api/v1/census/avatar/import",
      config: {
        payload: {
          output: "stream",
          allow: "multipart/form-data",
          parse: true
        }
      },
      handler: importAvatar
    }
    
  ]);

  next();
};

module.exports.register.attributes = {
  name: "routes.census"
};
