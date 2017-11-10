import * as fs from "fs";
import path from "path";
import csv from "csvtojson";

export default function importEmployees(request, reply) {
  const filePath = path.join(__dirname, "/../../data/Staff_Data_20171110.csv");
  csv().fromFile(filePath, (err, result) => {
    request.server.methods.db.saveEmployees(result, (err, returnChanges) => {
      if (err) {
        return reply(err).code(500);
      }
      return reply(returnChanges).code(200);
    });
  });
}
