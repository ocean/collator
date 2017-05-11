import Cheerio from 'cheerio';
// import fs from 'fs';
import url from 'url';
import goodGuyHttp from 'good-guy-http';

// const certFile = '/usr/local/etc/openssl/cert.pem';
const mediaLandingUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Mines-and-Petroleum.aspx';
// const mediaHref = url.parse(mediaLandingUrl).href;
// console.log(`mediaHref = ${mediaHref}`);
// The below is from the WHATWG URL spec, experimental in Node v7+
// const mediaOrigin = url.parse(mediaLandingUrl).origin;
// console.log(`mediaOrigin = ${mediaOrigin}`);

const goodGuy = goodGuyHttp({
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  proxy: 'http://proxy.bedrock.mft.wa.gov.au:8080',
  // tunnel: true,
  timeout: 15000,
  // ca: fs.readFileSync(certFile),
  // agentOptions: {
  //   ca: fs.readFileSync(certFile),
  // },
});

async function parseStatements(linkArray, callback) {
  // const statements = [];
  let err = null;
  // linkArray.forEach((link, index) => {
  // linkArray.forEach(async (link, index) => {
  //     // goodGuy(link).then((response) => {
  //     //   const $ = Cheerio.load(response.body.toString());
  //     //   const article = $('div#article');
  //     //   const title = article.find('h1').text();
  //     //   console.log(`title = ${title}`);
  //     //   const date = Date.parse(article.find($('div.newsCreatedDate')).text());
  //     //   console.log(`date = ${date}`);
  //     //   statements[index] = {
  //     //     url: link,
  //     //     title,
  //     //     date,
  //     //   };
  //     // })
  //     // .catch((error) => {
  //     //   console.dir(error);
  //     //   throw error;
  //     // });
  //   let response = await goodGuy(link);
  //   const $ = Cheerio.load(response.body.toString());
  //   const article = $('div#article');
  //   const title = article.find('h1').text();
  //   console.log(`title = ${title}`);
  //   const date = Date.parse(article.find($('div.newsCreatedDate')).text());
  //   console.log(`date = ${date}`);
  //   statements[index] = {
  //     url: link,
  //     title,
  //     date,
  //   };
  // });
  const statements = await linkArray.map(async (link, index) => {
    // goodGuy(link).then((response) => {
    //   const $ = Cheerio.load(response.body.toString());
    //   const article = $('div#article');
    //   const title = article.find('h1').text();
    //   console.log(`title = ${title}`);
    //   const date = Date.parse(article.find($('div.newsCreatedDate')).text());
    //   console.log(`date = ${date}`);
    //   const statement = {
    //     url: link,
    //     title,
    //     date,
    //   };
    //   return statement;
    // })
    // .catch((error) => {
    //   console.dir(error);
    //   throw error;
    // });
    const response = await goodGuy(link);
    const $ = Cheerio.load(response.body.toString());
    const article = $('div#article');
    const title = article.find('h1').text();
    console.log(`title = ${title}`);
    const date = Date.parse(article.find($('div.newsCreatedDate')).text());
    console.log(`date = ${date}`);
    return {
      url: link,
      title,
      date,
    };
  });
  // }
  console.dir(`Statements obj = ${statements}`);
  // return linkArray;
  callback(err, statements);
}

async function fetchStatementLinks(input, callback) {
  // console.log(input);
  // let string = Cheerio(input);
  const $ = Cheerio.load(input);
  const out = $('tr > td', 'div.cs-rollup-content > table');
  let err = null;
  const links = out.find('a');
  const linkPartials = [];
  links.each((idx, elem) => {
    linkPartials[idx] = $(elem).attr('href');
  });
  // console.dir(linkPartials);
  // const fullUrls = [];
  const fullUrls = linkPartials.map((link, index) => {
    // console.log(link);
    // let fullUrl = url.resolve(mediaHref, link);
    const fullUrl = url.resolve(mediaLandingUrl, link);
    console.log(`Full URL = ${fullUrl}`);
    return fullUrl;
  });
  // const result = fullUrls;
  await parseStatements(fullUrls, (parseError, results) => {
    if (parseError) {
      console.dir(parseError);
      throw parseError;
    }
    console.log('Results!');
    console.dir(results);
    callback(err, results);
  });
  // callback(err, result);
}

exports.getMinisterials = function getMinisterials(request, reply) {
  goodGuy(mediaLandingUrl).then((response) => {
    fetchStatementLinks(response.body.toString(), (error, result) => {
      if (error) {
        throw error;
      }
      console.log('"Result" is a ... ');
      console.log(result);
      // if (result.done) {
      //   reply(result);
      // } else {
      //   Promise.reject(error);
      // }
      reply(result);
    });
  })
    .catch((error) => {
      console.dir(error);
      throw error;
    });
};
