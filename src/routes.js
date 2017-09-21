import Collator from './handlers/collator';
import CommerceNews from './handlers/commerce-news';
import GovernmentNews from './handlers/government-news';
import IntranetNews from './handlers/intranet-news';
import Ministerials from './handlers/ministerials';
import TransportData from './handlers/transport-data';
import Tweets from './handlers/tweets';

module.exports = [
  // A test endpoint to check Hapi is working
  {
    method: 'GET',
    path: '/test',
    handler: function test(request, reply) {
      reply({
        message: 'Hello there!',
      });
    },
  },
  // Commerce Media Releases from the 'Announcements' section of the website
  {
    method: 'GET',
    path: '/api/v1/statements/commerce',
    handler: CommerceNews.getStatements,
  },
  {
    method: 'GET',
    path: '/api/v1/intranet/news',
    handler: IntranetNews.getIntranetNews,
  },
  {
    method: 'GET',
    path: '/api/v1/intranet/news/type/{newsType}',
    handler: IntranetNews.getIntranetNewsByType,
  },
  {
    method: 'GET',
    path: '/api/v1/statements/ministerials',
    handler: Ministerials.getMinisterials,
  },
  {
    method: 'GET',
    path: '/api/v1/statements/government',
    handler: GovernmentNews.getStatements,
  },
  {
    method: 'GET',
    path: '/api/v1/tweets/{list}',
    handler: Tweets.getTweets,
  },
  {
    method: 'GET',
    path: '/api/v1/combined',
    handler: Collator.collate,
  },
  {
    method: 'GET',
    path: '/api/v1/data/transport/departures/{location}',
    handler: TransportData.getDepartures,
    config: {
      cache: {
        expiresIn: 10000,
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/data/transport/updates',
    handler: TransportData.getUpdates,
  },
  // {
  //   method: 'GET',
  //   path: '/api/v1/data/weather/{location}',
  //   handler: WeatherData.getCurrent,
  // },

];
