var Higgins = function () {};

var pantry = require('pantry');

Higgins.prototype.newsPlease = function (url, feedType, clear) {
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
    return JSON.stringify(data, null, '  ');
//    res.write(JSON.stringify(data, null, '  '));
//    res.end();
  });
  
};

module.exports = new Higgins();