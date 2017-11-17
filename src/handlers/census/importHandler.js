import path from "path";
import * as fs from "fs";

import { csvFilter, uploader } from "../../utils/uploader";
import { dmirs2json } from "../../utils/convertor";

const UPLOAD_PATH = path.join(__dirname, "/../../data/");
const fileOptions = { dest: UPLOAD_PATH, fileFilter: csvFilter };

// create folder for upload if not exist
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

export default async function importHandler(request, reply) {
  try {
    // Get "Payload"
    const data = request.payload;
    const file = data["spreadsheet"];

    // Upload File
    const fileDetails = await uploader(file, fileOptions);

    // Convert dmirs2json is just a wrapper around csv2json
    // that parses in some specific params to clean up the data
    // being inserted into the db.
    const collection = await dmirs2json(fileDetails.path);

    // Insert the data.
    request.server.methods.db.insertCollection(collection, (error, result) => {
      if (error) reply(error).code(500);
      return reply(result).code(200);
    });
  } catch (error) {
    reply(error);
  }
}
