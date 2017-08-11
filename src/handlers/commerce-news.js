import xml2js from 'xml2js';
import goodGuyHttp from 'good-guy-http';

const goodGuy = goodGuyHttp({
  defaultCaching: {
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
      let statements = [];
      let rssItems = result.rss.channel[0].item;
      // console.dir(result.rss.channel[0].item);
      // console.dir(rssItems);
      rssItems.forEach(function(element) {
        statements.push({
          title: element.title,
          link: element.link,
          description: element.description,
          pubdate: element.pubDate,
          creator: element['dc:creator']
        })
      }, this);
      // console.dir(statements);
      reply(statements);
      // reply(result);
    });
  });
};
