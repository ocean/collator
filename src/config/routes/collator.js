import Joi from 'joi';
// import Collator from '../../handlers/collator';
import CommerceNews from '../../handlers/commerce-news';
import GovernmentNews from '../../handlers/government-news';
import IntranetNews from '../../handlers/intranet-news';
import Ministerials from '../../handlers/ministerials';
import TransportData from '../../handlers/transport-data';
import Tweets from '../../handlers/tweets';
import WeatherData from '../../handlers/weather-data';

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/intranet/news/{featured?}',
    options: {
      handler: IntranetNews.getIntranetNews,
      description: 'Intranet News',
      notes: 'News items (currently all of them) from the new Intranet.',
      tags: ['api', 'Intranet'],
      validate: {
        params: {
          featured: Joi.any().valid('', 'featured'),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/intranet/news/type/{newsType}/{featured?}',
    options: {
      handler: IntranetNews.getIntranetNewsByType,
      description: 'Intranet News',
      notes: 'News items, filtered by type, from the new Intranet.',
      tags: ['api', 'Intranet'],
      validate: {
        params: {
          newsType: Joi.any()
            .valid(
              'dmirs-news',
              'my-employment-news',
              'corporate-executive-news'
            )
            .required(),
          featured: Joi.any().valid('', 'featured'),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/statements/commerce',
    options: {
      handler: CommerceNews.getStatements,
      description: 'Commerce media',
      notes: 'Commerce media statements from the Commerce site.',
      tags: ['api', 'Statements'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/statements/ministerials',
    options: {
      handler: Ministerials.getMinisterials,
      description: "Minister's media",
      notes:
        'Ministerial media statements from the WA Govt Media Statements site - the Mines and Petroleum and Commerce and Industrial Relations portfolios.',
      tags: ['api', 'Statements'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/statements/government',
    options: {
      handler: GovernmentNews.getStatements,
      description: 'Government media',
      notes: 'All Government media statements from the Media Statements site.',
      tags: ['api', 'Statements'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/tweets/{list}',
    options: {
      handler: Tweets.getTweets,
      description: 'Tweets',
      notes:
        'Twitter updates from either @DMIRS_WA and related accounts or Perth transport information, including @Transperth and @Perth_Traffic.',
      tags: ['api', 'Tweets'],
      validate: {
        params: {
          list: Joi.any().valid('dmirs', 'transport').required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/data/transport/departures/{location}',
    handler: TransportData.getDepartures,
    options: {
      cache: {
        expiresIn: 30000,
      },
      validate: {
        params: {
          location: Joi.string()
            .valid('baldivis', 'cannington', 'carlisle', 'east-perth', 'perth')
            .required(),
        },
      },
      description: 'Departures',
      notes: 'Train departures information from Transperth live train times.',
      tags: ['api', 'Transport'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/data/transport/updates',
    options: {
      handler: TransportData.getUpdates,
      description: 'Updates',
      notes: 'Train service updates from Transperth train updates.',
      tags: ['api', 'Transport'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/data/weather/{location}',
    handler: WeatherData.getForecast,
    options: {
      cache: {
        expiresIn: 86400000,
      },
      validate: {
        params: {
          location: Joi.string()
            .valid(
              'albany',
              'baldivis',
              'broome',
              'bunbury',
              'cannington',
              'carlisle',
              'collie',
              'east-perth',
              'geraldton',
              'kalgoorlie',
              'karratha',
              'leonora',
              'marble-bar',
              'meekatharra',
              'mount-magnet',
              'perth',
              'southern-cross'
            )
            .required(),
        },
      },
      description: 'Updates',
      notes: 'Weather updates from Open Weather Map.',
      tags: ['api', 'Weather'],
    },
  },
];
