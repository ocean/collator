var tap = require('tap');
var higgins = require('./higgins.js');
var pantry = require('pantry');
//var JSONurl = 'http://date.jsontest.com';
//var JSONurl = 'http://echo.jsontest.com/testing/string/length/6';
var JSONurl = 'http://mockbin.org/bin/4bca20ff-ee43-4ea7-bb2e-30fe0581f9ce';
//var JSONurl = 'http://www.mocky.io/v2/56945fe81100000d1683a732';
var XMLurl = 'http://mockbin.org/bin/11e7735b-3cbc-4ac4-b476-492743745258';

tap.test('did the higgins library load', function (t) {
  t.ok(higgins, 'higgins library loaded');
  t.end();
});

//higgins.newsPlease(JSONurl, 'json', false, function (error, data) {
//  return data;
//});

tap.test('does higgins fetch a JSON URL and store it', { timeout: 5000 }, function (t) {
  
  higgins.newsPlease(JSONurl, 'json', false, function (error, data) {
    t.error(error, 'there is no error object');
    t.notOk(error, 'error object is falsy');
    t.ok(data, 'data returned is ok');
    t.type(data, 'object', 'data is an object');
    console.log('Data returned is:');
    console.dir(data, { color: true, depth: 5});
//    t.equals(pantry.storage.stockCount, 1, 'pantry has one item stored');
//    console.dir(pantry.storage.stockCount, { color: true, depth: 5});
//      console.dir(pantry.storage, { color: true, depth: 5});
    t.same(data, { testing: 'some text here', length: 14, type: 'string' }, 'returned data is what was expected');
    t.end();
//    console.dir(pantry.storage, { color: true, depth: 5});
  });
//  console.dir(pantry.storage, { color: true, depth: 5});
});

tap.test('does higgins force refresh a JSON URL if asked', { timeout: 5000 }, function (t) {

  higgins.newsPlease(JSONurl, 'json', true, function (error, data) {
    t.error(error, 'there is no error object');
    t.notOk(error, 'error object is falsy');
    t.ok(data, 'data returned is ok');
    t.type(data, 'object', 'data is an object');
//    console.log('Data returned is:');
//    console.dir(data, { color: true, depth: 5});
    t.same(data, { testing: 'some text here', length: 14, type: 'string' }, 'returned data is what was expected');
    t.end();
  });
});

tap.test('does higgins fetch an XML URL and store it', { timeout: 5000 }, function (t) {
  
  higgins.newsPlease(XMLurl, 'xml', false, function (error, data) {
    t.error(error, 'there is no error object');
    t.notOk(error, 'error object is falsy');
    t.ok(data, 'data returned is ok');
    t.type(data, 'string', 'data is a string');
//    console.log('Data returned is:');
//    console.dir(data, { color: true, depth: 5});
    t.same(data, 'Well this is interesting.', 'returned data is what was expected');
    t.end();
  });
});

tap.test('expect an error if we try to load a broken url', { timeout: 5000 }, function (t) {
  
  higgins.newsPlease('http://this-does-not-exist-really.in', 'json', false, function (error, data) {
    console.log('error obj is: ' + error);
    t.same(error, 'Invalid Response Code (503)', 'error is a 503 response code');
    t.ok(error, 'error object is truthy');
    t.notOk(data, 'data returned is not ok');
    t.same(data, undefined, 'data is undefined');
    t.end();
  });
});
