var Higgins = function () {};

var pantry = require('pantry');
var prettyjson = require('prettyjson');

Higgins.prototype.newsPlease = function (url, feedType, clear, callback) {
  pantry.configure({
    maxLife: 600,
    parser: 'xml'
  });
  
  pantry.fetch({
    uri: url
  }, function (error, data) {
    console.log('Fetching: ' + url);
    if (error) {
      console.log('pantry error: ' + error);
    }
    callback(prettyjson.render(data));
  });
  
};

module.exports = new Higgins();
