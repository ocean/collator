import goodGuyHttp from 'good-guy-http';

const goodGuy = goodGuyHttp({
  // defaultCaching: {
  //   timeToLive: 300000,
  // },
  // headers: {
  //   'User-Agent': 'Department of Commerce Intranet - request',
  // },
  // proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

exports.combinedNews = async function collateAllNews(request, reply) {
  const endpointProto = request.connection.server.info.protocol;
  const endpointPort = request.connection.server.info.port;
  // const checkHost = request.connection.server.info.host;
  // let endpointHost = '';
  // if (checkHost.indexOf('local') > 0) {
  //   endpointHost = 'localhost';
  // } else {
  //   endpointHost = checkHost;
  // }
  const endpointHost = 'localhost';
  const endpointUrl = `${endpointProto}://${endpointHost}:${endpointPort}`;
  // console.log('endpoint url:', endpointUrl);
  const news = [];
  let flattened = [];
  try {
    const commerceNews = await goodGuy(`${endpointUrl}/api/v1/statements/commerce`);
    const ministerials = await goodGuy(`${endpointUrl}/api/v1/statements/ministerials`);
    const governmentNews = await goodGuy(`${endpointUrl}/api/v1/statements/government`);
    const dmirsTweets = await goodGuy(`${endpointUrl}/api/v1/tweets/dmirs`);
    const combined = news.concat(
      JSON.parse(commerceNews.body.toString()),
      JSON.parse(ministerials.body.toString()),
      JSON.parse(governmentNews.body.toString()),
      JSON.parse(dmirsTweets.body.toString())
    );
    flattened = combined.reduce((a, b) => a.concat(b), []);
    console.log('items count =', flattened.length);
  } catch (error) {
    console.error('Error building combined feed:', error);
    throw error;
  }
  // console.dir(news);
  // reply('testing');
  // reply(combined);
  reply(flattened);
};
