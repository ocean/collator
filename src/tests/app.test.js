/* Simple app tests with ava. */

import test from 'ava';

import server from '../app';

test('did the app load', (t) => {
  t.truthy(server, 'Hapi server loaded');
});
