import goodGuyHttp from 'good-guy-http';
import he from 'he';
import moment from 'moment';
import xml2js from 'xml2js';
import hash from '../utils/hash';

const goodGuy = goodGuyHttp({
  forceCaching: {
    cached: true,
    timeToLive: 120000,
  },
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  timeout: 15000,
});
const { parseString } = xml2js;

// Commerce Media Releases from the 'Announcements' section of the website
exports.getStatements = function getCommerceNews(request, reply) {
  const newsUrl = 'http://www.commerce.wa.gov.au/announcements/182/all/feed';
  goodGuy(newsUrl).then((response) => {
    parseString(response.body, (err, result) => {
      if (err) {
        throw err;
      }
      const statements = [];
      const rssItems = result.rss.channel[0].item;
      rssItems.forEach((element) => {
        // Parse the date text into a proper Date object using moment.js and
        // the known formatting string
        const dateParsed = moment(element.pubDate.toString().trim(), 'YYYY-MM-DD HH:mm:ss');
        // Create a simple ISO 8601 date and time string for use in the feed object
        const dateTime = moment(dateParsed).format();
        statements.push({
          url: element.link.toString(),
          dateTime,
          title: he.decode(element.title.toString()),
          contents: element.description.toString(),
          type: 'statement',
          source: 'commerce',
          author: element['dc:creator'].toString(),
          id: hash.generate(element.title.toString() + dateTime),
        });
      }, this);
      reply(statements);
    });
  }).catch((err) => {
    console.error('Error fetching Commerce news:', err);
  });
};
