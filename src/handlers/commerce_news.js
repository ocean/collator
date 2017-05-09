import xml2js from 'xml2js';
import goodGuyHttp from 'good-guy-http';

const goodGuy = goodGuyHttp();
const parseString = xml2js.parseString;

// Commerce Media Releases from the 'Announcements' section of the website
exports.getNews = function getCommerceNews(request, reply) {
  const newsUrl = 'http://www.commerce.wa.gov.au/announcements/182/all/feed';
  goodGuy(newsUrl).then((response) => {
    parseString(response.body, (err, result) => {
      if (err) {
        throw err;
      }
      reply(result);
    });
  });
};
