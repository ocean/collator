import {
  getEmployeeHandler,
  getManagerHandler,
  getTeamHandler,
  importHandler,
  searchHandler
} from "../../handlers/census";

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
      handler: importHandler
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/search",
      handler: searchHandler,
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{id}",
      handler: getEmployeeHandler
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{id}/manager",
      handler: getManagerHandler
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{id}/team",
      handler: getTeamHandler
    }
    // {
    //   method: "GET",
    //   path: "/api/v1/census/employees/{employeeID}/avatar",
    //   handler: function test(request, reply) {
    //     reply({
    //       message: "Single Employee Avatar"
    //     });
    //   }
    // }
  ]);

  next();
};

module.exports.register.attributes = {
  name: "routes.census"
};
