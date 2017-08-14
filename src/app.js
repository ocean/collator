'use strict'; // eslint-disable-line

import Hapi from 'hapi';
import Good from 'good';

const server = new Hapi.Server();

// port setup with env var for hosting
server.connection({
  port: process.env.PORT || 3000,
});

// static file handler for public directory
server.register(require('inert'), (err) => {
  if (err) {
    console.log(err);
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{static*}',
    handler: {
      directory: {
        path: 'public',
        index: true,
      },
    },
  });
});

server.route(require('./routes.js'));

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*',
        }],
      }, {
        module: 'good-console',
      }, 'stdout'],
    },
  },
}, (err) => {
  if (err) {
    throw err;
  }

  server.start((error) => {
    if (error) {
      console.log(error);
      throw error;
    }
    server.log('info', `Server running at ${server.info.uri}`);
  });
});

// // Enable CORS for some domains
// // var corsWhitelist = ['http://203.33.230.66', 'http://www.commerce.wa.gov.au', 'https://www.commerce.wa.gov.au'];
// var corsOptions = { // eslint-disable-line
//   origin: function corsOriginCheck(origin, callback) {
// //    var originIsWhitelisted = corsWhitelist.indexOf(origin) !== -1;
// //    callback(null, originIsWhitelisted);
//     // Setting to "true" to whitelist all origins for development
//     callback(null, true);
//     console.log(chalk.red('Origin is: ') + chalk.cyan(origin));
//   },
// };
// app.use(cors(corsOptions));
