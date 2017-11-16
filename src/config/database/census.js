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
      .insert(entries, { conflict: "replace", returnChanges: true })
      .run(connection, callback);
  });

  // Returns the whole database to be filtered for searching.
  // RethinkDB suggests ElasticSearch for search which is
  // pretty much overkill for this. So I'm grabbing and caching
  // the full database and then using a searching library to match
  // against the query.

  server.method(
    "db.search",
    (callback) => {
      r
        .db(db)
        .table(employeesTable)
        .run(connection, callback);
    }
  );

  server.method("db.findEmployee", (employee, callback) => {
    r
      .db(db)
      .table(employeesTable)
      .filter({ userid: employee })
      .run(connection, callback);
  });

  server.method("db.findManager", (employee, callback) => {
    r
      .db(db)
      .table(employeesTable)
      .filter({ userid: employee })
      .innerJoin(r.db(db).table(employeesTable), (staff, manager) => {
        return staff("supervisor_userid").eq(manager("userid"));
      })
      .zip()
      .run(connection, callback);
  });

  server.method("db.findTeam", (employee, callback) => {
    r
      .db(db)
      .table(employeesTable)
      .filter({ userid: employee }) // Find requested employee.
      .innerJoin(
        r
          .db(db)
          .table(employeesTable)
          // Filter out any employees on "Secondment". This is from a combination
          // of "actingOrHDAFlag" and "HDA_termination_date".
          .filter(document =>
            r
              .and(document("actingOrHDAFlag").eq("N"))
              .and(document("HDA_termination_date").ne(""))
              .not()
          )
          // Filter out the requested employee from the team.
          .filter(document =>
            r
              .expr([employee])
              .contains(document("userid"))
              .not()
          ),
        (staff, team) => {
          // Equvilent of a self join to return all employees with the same "Manager"
          return staff("supervisor_userid").eq(team("supervisor_userid"));
        }
      )
      .zip()
      .run(connection, callback);
  });
};

exports.register.attributes = {
  name: "census"
};
