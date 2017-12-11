import Joi from "joi";
import Collator from "../../handlers/collator";
import CommerceNews from "../../handlers/commerce-news";
import GovernmentNews from "../../handlers/government-news";
import IntranetNews from "../../handlers/intranet-news";
import Ministerials from "../../handlers/ministerials";
import TransportData from "../../handlers/transport-data";
import Tweets from "../../handlers/tweets";
import WeatherData from "../../handlers/weather-data";

module.exports = [
  {
    method: "GET",
    path: "/api/v1/statements/commerce",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: CommerceNews.getStatements
    }
  },
  {
    method: "GET",
    path: "/api/v1/intranet/news/{featured?}",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: IntranetNews.getIntranetNews
    }
  },
  {
    method: "GET",
    path: "/api/v1/intranet/news/type/{newsType}/{featured?}",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: IntranetNews.getIntranetNewsByType
    }
  },
  {
    method: "GET",
    path: "/api/v1/statements/ministerials",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: Ministerials.getMinisterials
    }
  },
  {
    method: "GET",
    path: "/api/v1/statements/government",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: GovernmentNews.getStatements
    }
  },
  {
    method: "GET",
    path: "/api/v1/tweets/{list}",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: Tweets.getTweets
    }
  },
  {
    method: "GET",
    path: "/api/v1/data/transport/departures/{location}",
    handler: TransportData.getDepartures,
    config: {
      cache: {
        expiresIn: 30000
      },
      plugins: {
        pagination: {
          enabled: false
        }
      },
      validate: {
        params: {
          location: Joi.array().items(Joi.string().valid('baldivis', 'cannington', 'carlisle', 'east-perth', 'perth')).single()
        }
      },
    }
  },
  {
    method: "GET",
    path: "/api/v1/data/transport/updates",
    config: {
      plugins: {
        pagination: {
          enabled: false
        }
      },
      handler: TransportData.getUpdates
    }
  },
  {
    method: "GET",
    path: "/api/v1/data/weather/{location}",
    handler: WeatherData.getForecast,
    config: {
      cache: {
        expiresIn: 86400000
      },
      plugins: {
        pagination: {
          enabled: false
        }
      },
      validate: {
        params: {
          location: Joi.array().items(Joi.string().valid('albany', 'baldivis', 'broome', 'bunbury', 'cannington', 'carlisle', 'collie', 'east-perth', 'geraldton', 'kalgoorlie', 'karratha', 'leonora', 'marble-bar', 'meekatharra', 'mount-magnet', 'perth', 'southern-cross')).single()
        }
      },
    }
  }
];

