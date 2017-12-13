import connection from "../../config/database";
module.exports.register = (server, options, next) => {
  async function getOrganisation(next) {
    try {
      return next(null, { org: "soon" });
    } catch (error) {
      next(error);
    }
  }

  server.method("db.getOrganisation", getOrganisation, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getOrganisation"
};
