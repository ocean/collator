import CommerceNews from './handlers/commerce-news';
import GovernmentNews from './handlers/government-news';
import Ministerials from './handlers/ministerials';
import MirsTweets from './handlers/mirs-tweets';

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
    path: '/v1/get-commerce-media',
    handler: CommerceNews.getNews,
  },
  {
    method: 'GET',
    path: '/v1/get-ministerial-statements',
    handler: Ministerials.getMinisterials,
  },
  {
    method: 'GET',
    path: '/v1/get-government-statements',
    handler: GovernmentNews.getStatements,
  },
  {
    method: 'GET',
    path: '/v1/get-tweets',
    handler: MirsTweets.getTweets,
  },

];
