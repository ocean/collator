import goodGuyHttp from 'good-guy-http';
import moment from 'moment';
import xml2js from 'xml2js';

const goodGuy = goodGuyHttp({
  forceCaching: {
    timeToLive: 60000,
  },
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
});
const parseString = xml2js.parseString;

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
        const dateParsed = moment(element.pubDate.toString().trim(), 'YYYY-MM-DD HH:mm:ss');
        const dateString = moment(dateParsed).format('dddd, D MMMM YYYY');
        const dateUnix = moment(dateParsed).format('X');
        statements.push({
          url: element.link.toString(),
          dateString,
          dateUnix,
          title: element.title.toString(),
          contents: element.description.toString(),
          type: 'statement',
          source: 'commerce',
          author: element['dc:creator'].toString(),
        });
      }, this);
      reply(statements);
    });
  }).catch((err) => {
    console.error('Error fetching Commerce news:', err);
  });
};
