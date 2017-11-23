import connection from "../../config/database";
import * as fs from "fs";

module.exports.register = (server, options, next) => {
  async function saveAvatar(fileBuffer, fileName, mimetype, userID, dateTaken, next) {
    try {
      const insert = await connection
        .table("avatars")
        .insert({
          userid: userID,
          filename: fileName,
          mimetype,
          file: fileBuffer,
          taken: dateTaken
        }, { conflict: "replace" })
        .run();
      // There is probably no error checking here...
      if (insert) next(null, insert);
      else next("error");
    } catch (error) {
      next(error);
    }
  }

  server.method("db.saveAvatar", saveAvatar, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.saveAvatar"
};