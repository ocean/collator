import r from "rethinkdb";

exports.register = (server, options, next) => {
  const db = "census";
  const employeesTable = "employees";
  let connection = null;

  r.connect({ host: "localhost", port: 28015 }, (err, conn) => {
    if (err) throw err;
    connection = conn;

    r.dbCreate(db).run(connection, (err, result) => {
      r
        .db(db)
        .tableCreate(employeesTable, { primaryKey: "userid" })
        .run(connection, (err, result) => {
          return next();
        });
    });
  });

  server.method("db.saveEmployees", (entries, callback) => {
    r
      .db(db)
      .table(employeesTable)
      .insert(entries, { conflict: "replace" })
      .run(connection, callback);
  });

  server.method("db.findEmployee", (employee, callback) => {
    r
      .db(db)
      .table(employeesTable)
      .filter({ userid: employee })
      .count()
      .run(connection, callback);
  });
};

exports.register.attributes = {
  name: "rethink"
};
