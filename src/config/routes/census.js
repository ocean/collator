import { importHandler } from "../../handlers/census";

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: "GET",
      path: "/api/v1/census/employees/import",
      handler: importHandler
    },
    // {
    //   method: "GET",
    //   path: "/api/v1/census/employees/search/{query}",
    //   handler: (request, reply) => {
    //     const { query } = request.params;
    //     request.server.methods.db.search((err, returnChanges) => {
    //       if (err) return reply(err).code(500);
    //       return returnChanges.toArray((err, results) => reply(results).code(200));
    //     });

    //   },
    // },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}",
      handler: (request, reply) => {
        const { employeeID } = request.params;
        request.server.methods.db.findEmployee(
          employeeID.toUpperCase(),
          (err, returnChanges) => {
            if (err) return reply(err).code(500);
            return returnChanges.toArray((err, results) =>
              reply(results).code(200)
            );
          }
        );
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/manager",
      handler: (request, reply) => {
        const { employeeID } = request.params;
        request.server.methods.db.findManager(
          employeeID.toUpperCase(),
          (err, returnChanges) => {
            if (err) return reply(err).code(500);
            return returnChanges.toArray((err, results) =>
              reply(results).code(200)
            );
          }
        );
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/team",
      handler: (request, reply) => {
        const { employeeID } = request.params;
        request.server.methods.db.findTeam(
          employeeID.toUpperCase(),
          (err, returnChanges) => {
            if (err) return reply(err).code(500);
            return returnChanges.toArray((err, results) =>
              reply(results).code(200)
            );
          }
        );
      }
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
  name: "census-endpoints"
};
