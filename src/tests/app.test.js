/**
 * Created by drewrobinson on 8/06/2017.
 */

import test from 'ava';

import server from '../app';

test('did the app load', (t) => {
  t.truthy(server, 'Hapi server loaded');
});
