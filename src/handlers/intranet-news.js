import goodGuyHttp from 'good-guy-http';
import moment from 'moment';
import hash from '../hash';

const goodGuy = goodGuyHttp({
  forceCaching: {
    timeToLive: 60000,
  },
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  postprocess: resp => JSON.parse(resp.body.toString()),
  proxy: '',
});

let intranetNewsHost = '';
if (process.env.NODE_ENV === 'production') {
  intranetNewsHost = 'http://intranet.dias94.bedrock.mft.wa.gov.au';
} else {
  intranetNewsHost = 'http://intranet.vagrant.local';
}

// Intranet news, all items from this local server
exports.getIntranetNews = async function getIntranetNews(request, reply) {
  try {
    const newsResponse = await goodGuy(`${intranetNewsHost}/news-centre/api/v1/news/all`);

    const newsItems = [];
    newsResponse.forEach((element) => {
      const newsItem = element;
      const dateParsed = moment(element.dateUnix, 'X');
      const dateTime = dateParsed.format();
      newsItem.dateTime = dateTime;
      newsItem.contents = newsItem.contents.replace(/&nbsp;|\r\n/g, ' ');
      newsItem.id = hash.generate(newsItem.title);
      newsItems.push(newsItem);
    });
    reply(newsItems);
  } catch (error) {
    console.error('Error fetching all news items.', error);
    reply(error.response.body);
  }
};

// Intranet news items from this local server
exports.getIntranetNewsByType = async function getIntranetNewsByType(request, reply) {
  try {
    // Get the news type from the request parameter
    const { newsType } = request.params;
    const newsResponse = await goodGuy(`${intranetNewsHost}/news-centre/api/v1/news/type/${newsType}`);

    const newsItems = [];
    newsResponse.forEach((element) => {
      const newsItem = element;
      const dateParsed = moment(element.dateUnix, 'X');
      const dateTime = dateParsed.format();
      newsItem.dateTime = dateTime;
      newsItem.contents = newsItem.contents.replace(/&nbsp;|\r\n/g, ' ');
      newsItem.id = hash.generate(newsItem.title);
      newsItems.push(newsItem);
    });
    reply(newsItems);
  } catch (error) {
    console.error('Error fetching news items by type.', error);
    reply(error.response.body);
  }
};
