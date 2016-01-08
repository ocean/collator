var express = require('express');
var app = express();

var chalk = require('chalk');
var cheerio = require('cheerio');
var cors = require('cors');
var Higgins = require('./higgins.js');
var morgan = require('morgan');

// Morgan is a replacement for express.logger()
app.use(morgan('dev'));

// Serve anything in public as static files
app.use(express.static(__dirname + '/public'));

console.log(chalk.red('Node environment: ') + chalk.cyan(app.get('env')));

// Enable CORS for some domains
var corsWhitelist = ['http://203.33.230.66', 'http://www.commerce.wa.gov.au', 'https://www.commerce.wa.gov.au'];
var corsOptions = {
  origin: function (origin, callback) {
//    var originIsWhitelisted = corsWhitelist.indexOf(origin) !== -1;
//    callback(null, originIsWhitelisted);
    // Setting to "true" to whitelist all origins for development
    callback(null, true);
    console.log(chalk.red('Origin is: ') + chalk.cyan(origin));
  },
};
app.use(cors(corsOptions));

// Redirect root requests to a nice index page.
app.get('/', function (req, res) {
  res.redirect('/public/index.html');
});

// ========================================
// Public endpoints for returning JSON data
// ========================================

// 'v1' for Version 1 of the API :)

// Commerce Media Releases from the 'Announcements' section of the website
app.get('/v1/commerce-news', function (req, res, next) {
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

  Higgins.newsPlease(url, feedType, clear, function (error, news) {
    if (error) { return next(error); }
//    console.dir(news.$, { colors: 'true' });
//    console.dir(news.channel[0].item[5], { colors: 'true', depth: 5 });
//    console.log('Number of items: ' + news.channel[0].item.length);
//    res.type('json');
//    res.send(news);
    res.jsonp(news);
  });
});

app.get('/v1/ministerials', function (req, res, next) {
  // URL of Ministerial Media Statements built by this app
  var url = '/v1/build/ministerials';

  // Feed formatting instructions for Pantry - xml or json
  var feedType = 'json';

  // Get cache clear param from URL
  var clear = false;

  if (req.query.clearCache === 'true') {
    clear = true;
  }

  Higgins.newsPlease(url, feedType, clear, function (error, news) {
    if (error) { return next(error); }
//    res.send(news);
    res.jsonp(news);
  });
});

// ===================================
// Endpoints for building sets of data
// ===================================

app.get('/v1/build/ministerials', function (req, res, next) {
//  console.log('Request: ' + req);
  // URL of Ministerial Media Statements start page
  var startUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Commerce.aspx';

  res.jsonp({ "result": "This is where the data goes." });
//  res.send('some text here');
});

// ===================================
// All the error things go at the end.
// ===================================

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err.stack);
    console.error('Error stack: \n' + err.stack);
//    console.dir(req);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send('Error: ' + err.message);
  console.error('Error stack: \n' + err.stack);
});

// catch 404 as a final thing
app.use(function (req, res, next) {
  res.status(404).send('404 Not Found');
  console.dir(req);
});

// port setup with env var for Heroku
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on ' + port);
});
