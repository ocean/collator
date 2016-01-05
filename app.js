var express = require('express');
var app = express();
var morgan = require('morgan');
var chalk = require('chalk');
var Higgins = require('./higgins.js');

app.enable('jsonp callback');

// Morgan is a replacement for express.logger()
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

// Possibly redirect root requests to one versioned endpoint by default, or an endpoint listing.
//app.get('/', function (req, res) {
//  res.redirect('/v1/s');
//});

//Version 1 of the API :)
app.get('/v1/ministerials/:clear?', function (req, res) {
  // URL of Ministerial Media Statements
  var url = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Commerce.aspx';

  // Feed formatting instructions for Pantry - xml or json
  var feedType = 'xml';

  // Get cache clear param from URL
  var clear = false;

  if (req.query.clearCache === 'true') {
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

app.get('/v1/commerce-news', function (req, res) {
  // URL of Commerce Media Releases ("Announcements")
//  var url = 'http://www.commerce.wa.gov.au/taxonomy/term/182/feed';
  var url = 'http://www.commerce.wa.gov.au/announcements/182/all/feed';

  // Feed formatting instructions for Pantry - xml or json
  var feedType = 'xml';

  // Get cache clear query string from URL
  var clear = false;

  if (req.query.clearCache === 'true') {
    clear = true;
  }
//  console.log(chalk.magenta('Cache clear status is: %s'), clear);
//  console.dir(req.query);

  Higgins.newsPlease(url, feedType, clear, function (news) {
//    console.dir(news.$, { colors: 'true' });
//    console.dir(news.channel[0].item[5], { colors: 'true', depth: 5 });
//    console.log('Number of items: ' + news.channel[0].item.length);
//    res.type('json');
//    res.send(news);
    res.jsonp(news);
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
