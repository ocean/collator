import connection from "../../config/database";
import { differenceWith, size } from "lodash";

module.exports.register = (server, options, next) => {
  async function getMissingAvatars(next) {
    try {
      const avatars = await connection
        .table("avatars")
        .withFields("userid")
        .run();
      const employees = await connection
        .table("employees")
        .withFields("userid", "display_name")
        .run();
      const missing = differenceWith(await avatars, await employees, (a, b) => {
        return a["userid"] === b["userid"];
      });
      return next(null, missing);
    } catch (error) {
      next(error);
    }
  }

  server.method("db.getMissingAvatars", getMissingAvatars, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getMissingAvatars"
};
