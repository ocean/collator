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

  if (url.indexOf('http') == -1) {
    // URL is local
    if (process.env.HEROKU_URL) {
      url = process.env.HEROKU_URL + url;
    } else {
      url = 'http://localhost:3000' + url;
    }
  }
  console.log('URL is: ' + url);

  if (clear) {
    pantry.clear(url);
    console.log('Cleared cached copy of: ' + url);
  }

  pantry.fetch({
    uri: url,
  }, function (error, data) {
//    console.log('Fetching: ' + url);
    if (error) {
      console.log('pantry error: ' + error);
    }
//    callback(JSON.stringify(data, null, 2));
    callback(error, data);
//    console.dir(util.inspect(data, false, null));
  });

};

module.exports = new Higgins();
