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
  // t.log(console.dir(routes[0]));
});

// console.dir(server);

// test('check the homepage loads', async (t) => {
//   t.plan(1);
//   t.log(console.dir(server));
//   const res = await request(server)
//     .get('/');

//   t.log('do we get here?');
//   t.is(res.status, 200);
// });
