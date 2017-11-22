import connection from "../../config/database";

module.exports.register = (server, options, next) => {
  async function insertCollection(collection, next) {
    try {
      const insert = await connection
        .table("employees")
        .insert(collection, { conflict: "replace" })
        .run();
      // There is probably no error checking here...
      if (insert) next(null, insert);
      else next("error");
    } catch (error) {
      next(error);
    }
  }

  server.method("db.insertCollection", insertCollection, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.insertCollection"
};
