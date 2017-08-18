/* Simple app tests with ava. */

import test from 'ava';
// import request from 'supertest';

import server from '../app';

// const app = server();

test('did the app load', (t) => {
  t.truthy(server, 'Hapi server loaded');
  t.log(server);
});

// console.dir(server);

// test('check the homepage loads', async (t) => {
//   t.plan(1);
//   const res = await request(server)
//     .get('/');

//   t.is(res.status, 200);
// });
