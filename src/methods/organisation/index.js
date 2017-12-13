import connection from "../../config/database";
import _ from "lodash";

module.exports.register = (server, options, next) => {
  async function getOrganisation(next) {
    try {
      let structure = {};

      const organisation = await connection
        .table("employees")
        .filter(doc => {
          return doc("div").ne("");
        })
        .pluck("grp", "div", "sect", "bran");

      const filtered = Array.from(
        new Set(organisation.map(JSON.stringify))
      ).map(JSON.parse);

      filtered.map(obj => {
        _.merge(structure, { [obj.grp]: { [obj.div]: { [obj.bran]: [] } } });
        structure[obj.grp][obj.div][obj.bran].push(obj.sect);
      });

      return next(null, structure);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  server.method("db.getOrganisation", getOrganisation, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getOrganisation"
};
