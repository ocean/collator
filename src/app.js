'use strict'; // eslint-disable-line

import Hapi from 'hapi';
import Boom from 'boom';
import Good from 'good';
import etagger from 'etagger';
import inert from 'inert';
import vision from 'vision';
import hapiSwagger from 'hapi-swagger';
import hapiPagination from 'hapi-pagination';
import methods from './methods';

// port setup with env var for hosting
const server = Hapi.Server({
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: ['http://localhost:*', 'http://10.11.*', '*.local', '*.testsite', '*.wa.gov.au'],
      headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
    },
  },
});

const init = async () => {
  // static file handler for public directory
  await server.register(inert);

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

  await server.method(methods);

  // Register a Pagination Helper. Yo.
  await server.register({
    plugin: hapiPagination,
    options: {
      routes: {
        include: [],
        exclude: ['/documentation'],
      },
    },
  });

  // Register ETag functionality
  await server.register({
    plugin: etagger,
    options: {
      enabled: true,
    },
  });

  // Good process monitor and logger
  await server.register({
    plugin: Good,
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
  });

  // Register hapi-swagger Documentation Generator. Fool.
  await server.register([
    { plugin: vision },
    {
      plugin: hapiSwagger,
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

  await server.start();
  server.log('info', `Server running at ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  server.log('error', err);
  process.exit(1);
});

// Set up Bearer auth token scheme
server.auth.scheme('bearer-access-token', () => {
  if (!process.env.CENSUS_API_ACCESS_TOKEN) {
    throw Error('Error: An expected bearer token must be set in CENSUS_API_ACCESS_TOKEN environment variable.');
  }
  return {
    authenticate: (request, reply) => {
      const { authorization } = request.raw.req.headers;
      if (!authorization) {
        return reply(Boom.unauthorized('Authorisation required', 'Bearer'));
      }

      const parts = authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== 'bearer') {
        return reply(Boom.unauthorized('Bearer authorisation required', 'Bearer'));
      }

      const token = parts[1];
      const apiToken = process.env.CENSUS_API_ACCESS_TOKEN;
      if (token === apiToken) {
        return reply.continue({ credentials: { token } });
      }
      return reply(Boom.unauthorized('Invalid Bearer token', 'Bearer'));
    },
  };
});

// Register bearer access token authentication for POST handlers
server.auth.strategy('simple-token', 'bearer-access-token');

// The main sets of routes
server.route(require('./config/routes/collator'));
server.route(require('./config/routes/census'));

// Run the init function which starts the server.
init();
