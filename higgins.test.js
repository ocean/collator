var tap = require('tap');
var higgins = require('./higgins.js');
var pantry = require('pantry');
//var JSONurl = 'http://date.jsontest.com';
//var JSONurl = 'http://echo.jsontest.com/testing/string/length/6';
var JSONurl = 'http://mockbin.org/bin/4bca20ff-ee43-4ea7-bb2e-30fe0581f9ce';
//var JSONurl = 'http://www.mocky.io/v2/56945fe81100000d1683a732';

tap.test('did the higgins library load', function (t) {
  t.ok(higgins, 'higgins library loaded');
  t.end();
});

higgins.newsPlease(JSONurl, 'json', false, function (error, data) {
  return data;
});

tap.test('does higgins fetch a JSON URL and store it', { timeout: 5000 }, function (t) {
  higgins.newsPlease(JSONurl, 'json', false, function (error, data) {
//    console.log('error obj is: ' + error);
    t.error(error, 'there is no error object');
    t.notOk(error, 'error object is falsy');
    t.ok(data, 'data returned is ok');
    t.type(data, 'object', 'data is an object');
    console.dir('data obj is: ' + data, { color: true, depth: 5});
//    t.equals(pantry.storage.stockCount, 1, 'pantry has one item stored');
//    console.dir(pantry.storage.stockCount, { color: true, depth: 5});
//    console.dir(pantry.storage, { color: true, depth: 5});
    t.end();
  });
//  console.dir(pantry.storage, { color: true, depth: 5});
});

//console.dir(pantry.storage, { color: true, depth: 5});
