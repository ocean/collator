import connection from "../../config/database";

module.exports.register = (server, options, next) => {
  async function getEmployeesBySurname(letter, next) {
    try {
      const employees = await connection
        .table("employees")
        .filter((doc) => { return doc('surname').match(`^${letter}`)})
        .run();

      if (employees) next(null, employees);
      else next("error");
    } catch (error) {
      next(error);
    }
  }

  server.method("db.getEmployeesBySurname", getEmployeesBySurname, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getEmployeesBySurname"
};
