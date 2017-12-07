import connection from "../../config/database";

module.exports.register = (server, options, next) => {
  async function getEmployees(filter, next) {
    try {
      const { offset, limit, sort, ...filters } = filter;
      // Sort the sequence by document values of the given key(s). To specify the ordering,
      // wrap the attribute with either r.asc or r.desc (defaults to ascending).
      // sort is orderBy(surname).
      // order is order the surnames in ascending or descending. confusing!

      const employees = await connection
        .table("employees")
        .filter(filters)
        .orderBy(sort || "surname") // if no sort order is supplied default to surname.
        .skip(offset || 0)
        .limit(limit || 10)
        .run();

      const count = await connection
        .table("employees")
        .filter(filters)
        .count()
        .run();

      if (employees) next(null, { employees, count });
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
