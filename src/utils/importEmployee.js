import path from 'path';
import * as fs from 'fs';
import differenceWith from 'lodash/differenceWith';
import { csvFilter, uploader } from './uploader';
import { dmirs2json } from './convertor';

const UPLOAD_PATH = path.join(__dirname, '../../../../data');
const fileOptions = { dest: UPLOAD_PATH, fileFilter: csvFilter };

// create folder for upload if not exist
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

export default async function importEmployee(request, reply) {
  try {
    // Get "Payload"
    const data = request.payload;
    const file = data.spreadsheet;
    // Upload File
    const fileDetails = await uploader(file, fileOptions);

    // dmirs2json is just a wrapper around csv2json
    // that parses in some specific params to clean up the data
    // being inserted into the db.
    const newCollection = await dmirs2json(fileDetails.path);

    // Grab the current collection of staff from the DB
    const currentCollection = new Promise((resolve, reject) => {
      try {
        request.server.methods.db.getEmployees((error, employees) => {
          resolve(employees);
        });
      } catch (error) {
        reject(error);
      }
    });

    // Diff the collection.
    const documentsToRemove = await differenceWith(
      await currentCollection,
      await newCollection,
      (a, b) => a.userid === b.userid
    );

    // Remove the dead documents.
    // Can't work out how to get this in a Promise. :(
    const removed = await [];
    await documentsToRemove.forEach((document) => {
      request.server.methods.db.removeDocument(
        document.userid,
        (error, result) => {
          try {
            removed.push(result.changes);
          } catch (err) {
            reply(error);
          }
        }
      );
    });

    // Wrap in a Promise and do some magic.
    const insert = new Promise((resolve, reject) => {
      request.server.methods.db.insertCollection(
        newCollection,
        (error, result) => {
          try {
            resolve(result);
          } catch (err) {
            reject(error);
          }
        }
      );
    });

    // returns the "documentsToRemove" instead of the confirmed kills.
    // this is so we have a list of people to display in the UI.
    reply({ inserted: await insert, removed: await documentsToRemove });
  } catch (error) {
    console.log(error);
    reply(error);
  }
}
