import Dotenv from 'dotenv';
import goodGuyHttp from 'good-guy-http';
// import Twitter from 'twitter';
import url from 'url';

Dotenv.config();

// const client = new Twitter({
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   bearer_token: process.env.TWITTER_BEARER_TOKEN,
//   // access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
//   request_options: {
//     proxy: process.env.HTTP_PROXY,
//   },
// });

const twitterEndpointUrl = url.format({
  protocol: 'https',
  hostname: 'api.twitter.com',
  pathname: '1.1/lists/statuses.json',
  query: {
    count: 50,
    include_rts: true,
    // If this is passed as a Number, JavaScript will "round it" and break the URL
    list_id: '864326054462095361',
  },
});

const goodGuy = goodGuyHttp({
  defaultCaching: {
    timeToLive: 60000,
  },
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  },
  json: true,
  proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

// MIRS tweets from a list owned by @CommerceWA on Twitter
exports.getTweets = async function getTweets(request, reply) {
  // const params = {
  //   // screen_name: 'CommerceWA',
  //   list_id: 864326054462095361,
  //   count: 50,
  //   include_rts: true,
  //   // exclude_replies: true,
  // };
  // client.get('statuses/user_timeline', params, (error, tweets, response) => {
  // client.get('lists/statuses', params, (error, tweets, response) => {
  //   if (error) {
  //     console.log(error);
  //     throw error;
  //   }
  //   console.dir(response);
  //   // console.dir(tweets);
  //   console.log(`Number of tweets = ${tweets.length}`);
  //   reply(tweets);
  // });

  try {
    const response = await goodGuy(twitterEndpointUrl);
    const tweets = response.body;
    // console.dir(tweets);
    // console.log(`Number of tweets = ${tweets.length}`);
    reply(tweets);
  } catch (error) {
    console.log('Fetch of tweets failed', error);
  }
};
