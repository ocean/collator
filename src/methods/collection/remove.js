import connection from "../../config/database";

module.exports.register = (server, options, next) => {

  async function removeDocument(documentKey, next) {
    try {
      const remove = await connection
        .table("employees")
        .get(documentKey)
        .delete()
        .run();
      // There is probably no error checking here...
      if (remove) next(null, remove);
      else next("error");
    } catch (error) {
      next(error);
    }
  }

  server.method("db.removeDocument", removeDocument, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.removeDocument"
};
