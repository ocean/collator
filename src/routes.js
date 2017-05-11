import CommerceNews from './handlers/commerce_news';
import Ministerials from './handlers/ministerials2';

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

];
