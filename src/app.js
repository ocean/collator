'use strict'; // eslint-disable-line

import Hapi from 'hapi';
import Good from 'good';
import etagger from 'etagger';

const server = new Hapi.Server({
  // cache: [
  //   {
  //     name: 'redisCache',
  //     engine: require('catbox-redis'), // eslint-disable-line
  //     host: '127.0.0.1',
  //     partition: 'cache',
  //   },
  // ],
});

// port setup with env var for hosting
server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: ['*.local', '*.wa.gov.au'],
      headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
    },
    cache: {
      expiresIn: 60000,
    },
  },
});

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
