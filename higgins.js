var pantry = require('pantry');
// var util = require('util');

var Higgins = function setup() {};

Higgins.prototype.newsPlease = function hereIsTheNews(url, feedType, forceRefresh, callback) {
  var fetchLocation = url;
  pantry.configure({
    maxLife: 600,
//    parser: feedType,
    xmlOptions: {
      explicitRoot: false,
//      explicitChildren: true,
//      childKey: 'article',
    },
  });

  // Check if requested URL is local (relative), if so make it valid (absolute)
  if (fetchLocation.indexOf('http') === -1) {
    // URL has no http, so is relative
    if (process.env.HEROKU_URL) {
      // if on Heroku, add the app URL
      fetchLocation = process.env.HEROKU_URL + fetchLocation;
    } else {
      // if on local, add default Node URL
      fetchLocation = 'http://localhost:3000' + fetchLocation;
    }
  }
  console.log('URL is: ' + fetchLocation);

  if (forceRefresh) {
    pantry.remove(fetchLocation);
    console.log('Removed cached copy of: ' + fetchLocation);
  }

  pantry.fetch({
    uri: fetchLocation,
  }, function fetchThings(error, data) {
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
