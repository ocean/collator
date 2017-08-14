import req from 'request';
// import CommerceNews from './commerce-news';
// import GovernmentNews from './government-news';
// import Ministerials from './ministerials';
// import Tweets from './tweets';

exports.combinedNews = function collateAllNews(request, reply) {
  // console.dir(request);
  console.dir(request.connection.server.info);
  // console.dir(server.info);
  const endpointProto = request.connection.server.info.protocol;
  console.log(endpointProto);
  const endpointPort = request.connection.server.info.port;
  console.log(endpointPort);
  const checkHost = request.connection.server.info.host;
  console.log(checkHost);
  let endpointHost = '';
  if (checkHost.indexOf('local') > 0 ) {
    console.log('localhost fired');
    endpointHost = 'localhost';
  } else {
    console.log('remote host fired');
    endpointHost = checkHost;
  };
  // const endpointUrl = 'http://localhost:3000';
  const endpointUrl = `${endpointProto}://${endpointHost}:${endpointPort}`;
  console.log('endpoint url:', endpointUrl);
  let news = [];
  req(`${endpointUrl}/api/v1/statements/commerce`, (error, response, body) => {
    if (error) {
      console.log(error);
    }
    // console.log(body);
    news.push(JSON.parse(body));
    console.dir(news);
  });
  console.dir(news);
  reply('testing');
};
