import CommerceNews from './handlers/commerce-news';
import GovernmentNews from './handlers/government-news';
import Ministerials from './handlers/ministerials';
import Collator from './handlers/collator';
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
    handler: Collator.combinedNews,
  },
  // {
  //   method: 'GET',
  //   path: '/api/v1/data/transport/departures',
  //   handler: TransportData.getDepartures,
  // },
  // {
  //   method: 'GET',
  //   path: '/api/v1/data/transport/updates',
  //   handler: TransportData.getUpdates,
  // },
  // {
  //   method: 'GET',
  //   path: '/api/v1/data/weather/{location}',
  //   handler: WeatherData.getCurrent,
  // },

];
