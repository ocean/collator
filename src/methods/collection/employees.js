import connection from "../../config/database";

module.exports.register = (server, options, next) => {
  async function getEmployees(next) {
    try {
      const employees = await connection
        .table("employees")
        .run();

      if (employees) next(null, employees);
      else next("error");
    } catch (error) {
      next(error);
    }
  }

  server.method("db.getEmployees", getEmployees, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getEmployees"
};
