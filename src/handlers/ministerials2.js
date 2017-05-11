import Cheerio from 'cheerio';
import url from 'url';
import goodGuyHttp from 'good-guy-http';

const mediaLandingUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Mines-and-Petroleum.aspx';

const goodGuy = goodGuyHttp({
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  proxy: 'http://proxy.bedrock.mft.wa.gov.au:8080',
  timeout: 15000,
});

exports.getMinisterials = async function getMinisterials(request, reply) {
  const landingResponse = await goodGuy(mediaLandingUrl);
  const $ = Cheerio.load(landingResponse.body.toString());
  const landingPage = $('tr > td', 'div.cs-rollup-content > table');
  const statementLinks = landingPage.find('a');
  const linkPartials = [];
  statementLinks.each((idx, elem) => {
    linkPartials[idx] = $(elem).attr('href');
  });
  const fullUrls = linkPartials.map((link, index) => {
    const fullUrl = url.resolve(mediaLandingUrl, link);
    console.log(`Full URL ${index} = ${fullUrl}`);
    return fullUrl;
  });
  const statements = await fullUrls.map(async (link) => {
    const statementResponse = await goodGuy(link);
    const $c = await Cheerio.load(statementResponse.body.toString());
    const article = $c('div#article');
    const title = article.find('h1').text();
    console.log(`title = ${title}`);
    const date = Date.parse(article.find($c('div.newsCreatedDate')).text());
    console.log(`date = ${date}`);
    return {
      url: link,
      title,
      date,
    };
  });
  console.log('Statements obj = ');
  console.dir(await statements);
  reply(await statements);
};
