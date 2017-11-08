/* Simple app tests with ava. */

import test from 'ava';
// import request from 'supertest';

import server from '../app';
import routes from '../routes';

// const app = server();

// test.beforeEach((t) => {
//   t.context.server = server;
// });

test('did the app load', (t) => {
  t.truthy(server, 'Hapi server loaded');
  // t.log(server);
});

test('did the routes load', (t) => {
  t.truthy(routes, 'Hapi routes loaded');
  // t.log(console.dir(routes));
});

const homeTest = {
  method: 'GET',
  url: '/',
};

test('check the homepage loads', async (t) => {
  t.plan(1);
  // t.log(console.dir(server));
  const request = Object.assign({}, homeTest);

  const response = await server.inject(request);

  // t.log('do we get here?');
  t.is(response.statusCode, 200);
  // t.log(console.dir(response));
});
