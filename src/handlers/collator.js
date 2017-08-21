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
  // const news = [];
  // let sortable = [];
  const combined = [];
  let flattened = [];
  try {
    const commerceNews = await goodGuy(`${endpointUrl}/api/v1/statements/commerce`);
    const ministerials = await goodGuy(`${endpointUrl}/api/v1/statements/ministerials`);
    const governmentNews = await goodGuy(`${endpointUrl}/api/v1/statements/government`);
    const dmirsTweets = await goodGuy(`${endpointUrl}/api/v1/tweets/dmirs`);
    // const combined = news.concat(
    //   JSON.parse(commerceNews.body.toString()),
    //   JSON.parse(ministerials.body.toString()),
    //   JSON.parse(governmentNews.body.toString()),
    //   JSON.parse(dmirsTweets.body.toString())
    // );
    const commerceNewsItems = JSON.parse(commerceNews.body.toString());
    const ministerialsItems = JSON.parse(ministerials.body.toString());
    const governmentNewsItems = JSON.parse(governmentNews.body.toString());
    const dmirsTweetsItems = JSON.parse(dmirsTweets.body.toString());
    const itemCounter = {
      commerce: 2,
      government: 0,
      ministerial: 1,
      twitter: 2,
    };
    const iterations = commerceNewsItems.length / itemCounter.commerce;
    // sortable = [
    //   { name: commerceNewsItems, length: commerceNewsItems.length },
    //   { name: ministerialsItems, length: ministerialsItems.length },
    //   { name: governmentNewsItems, length: governmentNewsItems.length },
    //   { name: dmirsTweetsItems, length: dmirsTweetsItems.length },
    // ];
    // sortable.sort((a, b) => a.value - b.value);
    // console.log('shortest =', sortable[0].name);
    let i = 0;
    while (i < iterations) {
      const subarray = [];
      let c = 0;
      while (c < itemCounter.commerce) {
        subarray.push(commerceNewsItems.shift());
        c += 1;
      }
      let g = 0;
      while (g < itemCounter.government) {
        subarray.push(governmentNewsItems.shift());
        g += 1;
      }
      let m = 0;
      while (m < itemCounter.ministerial) {
        subarray.push(ministerialsItems.shift());
        m += 1;
      }
      let t = 0;
      while (t < itemCounter.commerce) {
        subarray.push(dmirsTweetsItems.shift());
        t += 1;
      }
      combined.push(subarray);
      i += 1;
    }
    flattened = combined.reduce((a, b) => a.concat(b), []);
    console.log('items count =', flattened.length);
  } catch (error) {
    console.error('Error building combined feed:', error);
    throw error;
  }
  // console.dir(news);
  reply(combined);
  // reply(flattened);
  // reply(sortable);
};
