import connection from "../../config/database";

module.exports.register = (server, options, next) => {
  async function getManager(id, next) {
    try {
      const manager = connection
        .table("employees")
        .filter({ userid: id.toUpperCase() })
        .innerJoin(connection.table("employees"), (user, supervisor) => {
          return user("supervisor_userid").eq(supervisor("userid"));
        })
        .zip()
        .run();

      if (manager) next(null, manager);
      else next("error");
    } catch (error) {
      next(error);
    }
  }

  server.method("db.getManager", getManager, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getManager"
};
