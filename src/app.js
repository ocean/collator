'use strict'; // eslint-disable-line

import Hapi from 'hapi';
import Good from 'good';
import etagger from 'etagger';
import vision from 'vision';
import hapiSwagger from 'hapi-swagger';
import methods from './methods';
// import RedisCache from 'catbox-redis';


const server = new Hapi.Server();

// port setup with env var for hosting
server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: ['http://localhost:*', 'http://10.11.*', '*.local', '*.testsite', '*.wa.gov.au'],
      headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
    },
    // cache: {
    //   expiresIn: 60000,
    // },
  },
});

server.register(methods, (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});


// Register a Pagination Helper. Yo.
server.register(require('./utils/pagination'));

// Register a Documenation Generator . Fool.

server.register({
  register: etagger,
  options: {
    enabled: true,
  },
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
    config: {
      plugins: {
        pagination: {
          enabled: false,
        },
      },
    },
  });
});


server.route(require('./config/routes/collator'));
server.register(require('./config/routes/census'));

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

  if (!module.parent) {
    server.start((error) => {
      if (error) {
        console.log(error);
        throw error;
      }
      server.log('info', `Server running at ${server.info.uri}`);
    });
  }
});


server.register([
  { register: vision },
  {
    register: hapiSwagger,
    options: {
      info: {
        title: 'Collatorrroror Documentation',
        version: '1.0.0',
      },
      basePath: '/api/v1',
      grouping: 'tags',
    },
  },
]);

module.exports = server;
