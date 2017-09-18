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

let intranetNewsUrl = '';
if (process.env.NODE_ENV === 'production') {
  intranetNewsUrl = 'http://intranet.dias94.bedrock.mft.wa.gov.au/news-centre/api/v1/news/all';
} else {
  intranetNewsUrl = 'http://intranet.vagrant.local/news-centre/api/v1/news/all';
}

// Intranet news items from this local server
exports.getIntranetNews = async function getIntranetNews(request, reply) {
  try {
    const newsResponse = await goodGuy(intranetNewsUrl);

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
    console.error('Error fetching Intranet news:', error);
  }
};
