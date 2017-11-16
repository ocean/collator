import { getEmployeeHandler, getManagerHandler, getTeamHandler } from "../../handlers/census";

module.exports.register = (server, options, next) => {
  server.route([
    // {
    //   method: "GET",
    //   path: "/api/v1/census/employees/import",
    //   handler: importHandler,
    // },
    // {
    //   method: "GET",
    //   path: "/api/v1/census/employees/search",
    //   handler: searchEmployees,
    // },
    {
      method: "GET",
      path: "/api/v1/census/employees/{id}",
      handler: getEmployeeHandler,
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{id}/manager",
      handler: getManagerHandler,
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{id}/team",
      handler: getTeamHandler,
    }
    // {
    //   method: "GET",
    //   path: "/api/v1/census/employees/{employeeID}/team",
    //   handler: function test(request, reply) {
    //     reply({
    //       message: "Single Employee Team"
    //     });
    //   }
    // },
    // {
    //   method: "GET",
    //   path: "/api/v1/census/employees/{employeeID}/manager",
    //   handler: function test(request, reply) {
    //     reply({
    //       message: "Single Employee Manager"
    //     });
    //   }
    // },
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
