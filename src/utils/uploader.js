import * as uuid from "uuid";
import * as fs from "fs";

const csvFilter = fileName => {
  if (!fileName.match(/\.(csv)$/)) {
    return false;
  }
  return true;
};

const uploader = (file, options) => {
  if (!file) throw new Error("No file. Please upload the required file. yo.");
  return _fileHandler(file, options);
};

const _fileHandler = (file, options) => {
  // console.log('here');
  if (!file) throw new Error("No file. Please upload the required file. yo.");

  const originalName = file.hapi.filename;
  // const filename = uuid.v1();
  const path = `${options.dest}${file.hapi.filename}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on("error", err => reject(err));
    file.pipe(fileStream);
    file.on("end", err => {
      const fileDetails = {
        fieldName: file.hapi.name,
        originalName: file.hapi.filename,
        mimetype: file.hapi.headers["content-type"],
        destination: `${options.dest}`,
        path,
        size: fs.statSync(path).size
      };

      resolve(fileDetails);
    });
  });
};

export { uploader, csvFilter };
