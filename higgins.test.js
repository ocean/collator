var tap = require('tap');
var higgins = require('./higgins.js');
// var pantry = require('pantry');
// var JSONurl = 'http://date.jsontest.com';
var JSONurl = 'http://echo.jsontest.com/echo/testing/test/one';
// var JSONurl = 'http://www.mocky.io/v2/56945fe81100000d1683a732';
// var XMLurl = 'https://httpbin.org/xml';
var XMLurl = 'http://httpbin.org/xml';

tap.test('did the higgins library load', function didLoad(t) {
  t.ok(higgins, 'higgins library loaded');
  t.end();
});

tap.test('does higgins fetch a JSON URL and store it', { timeout: 5000 }, function fetchJSON(t) {
  higgins.newsPlease(JSONurl, 'json', false, function getJSON(error, data) {
    t.error(error, 'there is no error object');
    t.notOk(error, 'error object is falsy');
    t.ok(data, 'data returned is ok');
    t.type(data, 'object', 'data is an object');
    // console.log('Data returned is:');
    // console.dir(data, { color: true, depth: 5});
//    t.equals(pantry.storage.stockCount, 1, 'pantry has one item stored');
//    console.dir(pantry.storage.stockCount, { color: true, depth: 5});
//      console.dir(pantry.storage, { color: true, depth: 5});
    t.same(data, { test: 'one', echo: 'testing' },
      'returned data is what was expected');
    t.end();
//    console.dir(pantry.storage, { color: true, depth: 5});
  });
//  console.dir(pantry.storage, { color: true, depth: 5});
});

tap.test('does higgins force refresh a JSON URL if asked', { timeout: 5000 },
  function refreshJSON(t) {
    higgins.newsPlease(JSONurl, 'json', true, function getAgainJSON(error, data) {
      t.error(error, 'there is no error object');
      t.notOk(error, 'error object is falsy');
      t.ok(data, 'data returned is ok');
      t.type(data, 'object', 'data is an object');
  //    console.log('Data returned is:');
  //    console.dir(data, { color: true, depth: 5});
      t.same(data, { test: 'one', echo: 'testing' },
        'returned data is what was expected');
      t.end();
    });
  });

tap.test('does higgins fetch an XML URL and store it', { timeout: 5000 }, function fetchXML(t) {
  higgins.newsPlease(XMLurl, 'xml', false, function getXML(error, data) {
    t.error(error, 'there is no error object');
    t.notOk(error, 'error object is falsy');
    t.ok(data, 'data returned is ok');
    t.type(data, 'object', 'data is an object');
    // console.log('Data returned is:');
    // console.dir(data, { color: true, depth: 5 });
    t.match(data.$.author, 'Yours Truly', 'returned data is what was expected');
    t.end();
  });
});

tap.test('expect an error if we try to load a broken url', { timeout: 5000 },
  function errorWithBroken(t) {
    higgins.newsPlease('http://this-does-not-exist-really.in', 'json', false, function getBroken(error, data) {
      console.log('error obj is: ' + error);
      t.match(error, /error|invalid/i, 'error contains the string "error" or "invalid"');
      t.ok(error, 'error object is truthy');
      t.notOk(data, 'data returned is not ok');
      t.same(data, undefined, 'data is undefined');
      t.end();
    });
  });
