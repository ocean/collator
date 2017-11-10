import { importHandler } from '../../handlers/census';

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/v1/census/employees/import',
      handler: importHandler,
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}",
      handler: (request, reply) => {

        const { employeeID } = request.params;

        request.server.methods.db.findEmployee(employeeID, (err, returnChanges) => {
          if (err) return reply(err).code(500);
          console.log(returnChanges);
          return reply().code(200);
        });
      },
    },
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
  name: 'census-endpoints',
}
