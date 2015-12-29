var express = require('express'),
  app = express(),
  logger = require('morgan'),
  Higgins = require('./higgins.js'),
  pantry = require('pantry');

app.enable('jsonp callback');

// Morgan is a replacement for express.logger()
app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));

var out = '';
var result = {};

// Possibly redirect root requests to one versioned endpoint by default, or an endpoint listing.
//app.get('/', function (req, res) {
//  res.redirect('/v1/s');
//});
//app.get('/s', function (req, res) {
//  res.redirect('/v1/s');
//});

//Version 1 of the API :)
app.get('/v1/ministerials/:clear?', function (req, res) {
  // Ignore browser requests for Favicon
//  if (req.url == "/favicon.ico") return false;
  
  // URL of Ministerial Media Statements
  var url = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Commerce.aspx';
  
  // Feed formatting - xml or json
  var feedType = 'xml';

  // Get cache clear param from URL
  var clear = req.params.clear;
  
  //Higgins.newsPlease()

  res.send('\r\r' + JSON.stringify(result, null, '  '));
  res.end();

  req.on('error', function (e) {
    console.log('request error: ' + e.message);
  });
});

app.get('/v1/commerce-news/:clear?', function (req, res) {
  // URL of Commerce Media Releases ("Announcements")
  var url = 'http://www.commerce.wa.gov.au/taxonomy/term/182/feed';
  
  // Feed formatting - xml or json
  var feedType = 'xml';

  // Get cache clear param from URL
  var clear = false;
  
  if (req.params.clear === 'clear-cache') {
    clear = true;
  }
  
  Higgins.newsPlease(url, feedType, clear, function (news) {
    res.send(news);
    res.end();
  });
  
  req.on('error', function (e) {
    console.log('request error: ' + e.message);
  });
});

/// catch 404 and forwarding to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    console.log('error: ' + err);
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    }); 
});
*/

// port setup with env var for Heroku
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on ' + port);
});
