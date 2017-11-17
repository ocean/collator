const connection = require("rethinkdbdash")({
  host: "localhost",
  port: 28015,
  db: "census",
});

module.exports = connection;