import Cheerio from 'cheerio';
import goodGuyHttp from 'good-guy-http';

const goodGuy = goodGuyHttp({
  // proxy: 'https://proxy.bedrock.mft.wa.gov.au:8080',
  // tunnel: true,
  timeout: 30000,
});

function fetchStatements(input, callback) {
  // console.log(input);
  // let string = Cheerio(input);
  const $ = Cheerio.load(input);
  let out = $('div.cs-rollup-content > table > tbody > tr > td');
  // let out = $('div.cs-rollup-content > table > tbody > tr > td:has(a)');
  let error = null;
  let result = out.find('a').contents();
  // let result = out;
  console.dir(result);
  console.log(result);
  callback(error, result);
}

exports.getMinisterials = function getMinisterials(request, reply) {
  const mediaDmpTopUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Mines-and-Petroleum.aspx';
  goodGuy(mediaDmpTopUrl).then((response) => {
    fetchStatements(response.body.toString(), (error, result) => {
      if (error) {
        throw error;
      }
      reply(result);
    });
  })
    .catch((error) => {
      console.dir(error);
      throw error;
    });
};
