require('dotenv').config();
const connection = require('rethinkdbdash')({
  host: process.env.RETHINKDB_HOST,
  port: process.env.RETHINKDB_PORT,
  db: process.env.RETHINKDB_DB,
});

module.exports = connection;
