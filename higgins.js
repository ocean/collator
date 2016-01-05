var pantry = require('pantry');
var util = require('util');

var Higgins = function () {};

Higgins.prototype.newsPlease = function (url, feedType, clear, callback) {
  pantry.configure({
    maxLife: 600,
//    parser: feedType,
    xmlOptions: {
      explicitRoot: false,
//      explicitChildren: true,
//      childKey: 'article',
    },
  });

  pantry.fetch({
    uri: url,
  }, function (error, data) {
//    console.log('Fetching: ' + url);
    if (error) {
      console.log('pantry error: ' + error);
    }
//    callback(JSON.stringify(data, null, 2));
    callback(data);
//    console.dir(util.inspect(data, false, null));
  });

};

module.exports = new Higgins();
