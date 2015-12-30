var Higgins = function () {};

var pantry = require('pantry');

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
    callback(JSON.stringify(data, null, 2));
  });
  
};

module.exports = new Higgins();
