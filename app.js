'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Collator = require('./collator.js');

// const collator = require('./collator.js');

const server = new Hapi.Server();

// port setup with env var for hosting
server.connection({
  port: process.env.PORT || 8000,
  host: 'localhost'
});

// static file handler for public directory
server.register(require('inert'), (err) => {
  if (err) {
    console.log(err);
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{static*}',
    handler: {
      directory: {
        path: 'public',
        index: true
      }
    }
  })
});

server.route([
  {
    method: 'GET',
    path: '/test',
    handler: function (request, reply) {
      reply({
        message: 'Hello there!'
      })
    }
  },
  {
    method: 'GET',
    path: '/v1/{path*}',
    handler: function (request, reply) {
      Collator.get(request, function callback(error, data) {
        // if (error) {
        //   throw error;
        // }
        reply(data);
      });
      // typeof results;
      // reply(results);
    }
  }
]);

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {
  if (err) {
    throw err;
  }

  server.start((err) => {
    if (err) {
      console.log(err);
      throw err;
    }
    server.log('info', `Server running at ${server.info.uri}`);
  });
});


// Serve anything in public as static files
// app.use(express.static(path.join(__dirname, 'public')));
//
// console.log(chalk.red('Node environment: ') + chalk.cyan(app.get('env')));
//
// // Enable CORS for some domains
// // var corsWhitelist = ['http://203.33.230.66', 'http://www.commerce.wa.gov.au', 'https://www.commerce.wa.gov.au'];
// var corsOptions = { // eslint-disable-line
//   origin: function corsOriginCheck(origin, callback) {
// //    var originIsWhitelisted = corsWhitelist.indexOf(origin) !== -1;
// //    callback(null, originIsWhitelisted);
//     // Setting to "true" to whitelist all origins for development
//     callback(null, true);
//     console.log(chalk.red('Origin is: ') + chalk.cyan(origin));
//   },
// };
// app.use(cors(corsOptions));
//
// // Redirect root requests to a nice index page.
// app.get('/', function getRoot(req, res) {
//   res.redirect('/public/index.html');
// });
//
// // ========================================
// // Public endpoints for returning JSON data
// // ========================================
//
// // 'v1' for Version 1 of the API :)
//
// // Commerce Media Releases from the 'Announcements' section of the website
// app.get('/v1/commerce-news', function getCommerceNews(req, res, next) {
//   // URL of Commerce Media Releases ("Announcements")
// //  var url = 'http://www.commerce.wa.gov.au/taxonomy/term/182/feed';
//   var url = 'http://www.commerce.wa.gov.au/announcements/182/all/feed';
//
//   // Feed formatting instructions for Pantry - xml or json
//   var feedType = 'xml';
//
//   // Get cache clear query string from URL
//   var forceRefresh = false;
//
//   if (req.query.forceRefresh === 'true') {
//     forceRefresh = true;
//   }
// //  console.log(chalk.magenta('Cache clear status is: %s'), clear);
// //  console.dir(req.query);
//
//   collator.newsPlease(url, feedType, forceRefresh, function newsCB(error, news) {
//     if (error) { return next(error); }
// //    console.dir(news.$, { colors: 'true' });
// //    console.dir(news.channel[0].item[5], { colors: 'true', depth: 5 });
// //    console.log('Number of items: ' + news.channel[0].item.length);
// //    res.type('json');
//     res.jsonp(news);
//     return true;
//   });
// });
//
// app.get('/v1/ministerials', function getMinisterials(req, res, next) {
//   // URL of Ministerial Media Statements built by this app
//   var url = '/v1/build/ministerials';
//
//   // Feed formatting instructions for Pantry - xml or json
//   var feedType = 'json';
//
//   // Get cache clear param from URL
//   var forceRefresh = false;
//
//   if (req.query.forceRefresh === 'true') {
//     forceRefresh = true;
//   }
//
//   collator.newsPlease(url, feedType, forceRefresh, function ministerialsCB(error, news) {
//     if (error) { return next(error); }
// //    res.send(news);
//     res.jsonp(news);
//     return true;
//   });
// });
//
// // ===================================
// // Endpoints for building sets of data
// // ===================================
//
// app.get('/v1/build/ministerials', function buildMinisterials(req, res) {
// //  console.log('Request: ' + req);
//   // URL of Ministerial Media Statements start page
//   // var startUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Commerce.aspx';
//
//   res.jsonp(JSON.stringify({ result: 'This is where the data goes.' }));
// });
//
// // ===================================
// // All the error things go at the end.
// // ===================================
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function devError(err, req, res, next) {
//     res.status(err.status || 500).send(err.stack);
//     console.error('Error stack: \n' + err.stack);
// //    console.dir(req);
//     next(err);
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function errorHandler(err, req, res, next) {
//   res.status(err.status || 500).send('Error: ' + err.message);
//   console.error('Error stack: \n' + err.stack);
//   next(err);
// });
//
// // catch 404 as a final thing
// app.use(function notFoundHandler(req, res) {
//   res.status(404).send('404 Not Found');
//   console.dir(req);
// });
