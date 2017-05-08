import Cheerio from 'cheerio';

function fetchStatements(input, callback) {
  console.log(input);
  let string = Cheerio(input);
  let error = null;
  let result = null;
  callback(error, result);
};

exports.getMinisterials = function getMinisterials(request, reply) {
  const mediaDmpTopUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Mines-and-Petroleum.aspx';
  this.goodGuy(mediaDmpTopUrl).then((response) => {
    fetchStatements(response.body.toString(), (error, result) => {
      if (error) {
        throw error;
      }
      reply(result);
    });
  });
};
