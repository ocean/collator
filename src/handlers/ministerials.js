import Cheerio from 'cheerio';
import goodGuyHttp from 'good-guy-http';
import moment from 'moment';
import url from 'url';

const mediaLandingUrl = 'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Mines-and-Petroleum.aspx';

const goodGuy = goodGuyHttp({
  defaultCaching: {
    timeToLive: 300000,
  },
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

exports.getMinisterials = async function getMinisterials(request, reply) {
  // Fetch the media statements landing page and wait for it to return
  const landingResponse = await goodGuy(mediaLandingUrl);
  // Load the HTML body into Cheerio
  const $ = Cheerio.load(landingResponse.body.toString());
  // Extract the data from the table of links
  const landingPage = $('tr > td', 'div.cs-rollup-content > table');
  // Get an array of the link elements
  const statementLinks = landingPage.find('a');
  // Create an array for holding the relative URLs from these links
  const linkPartials = [];
  // For each link element, extract the href attribute
  statementLinks.each((idx, elem) => {
    linkPartials[idx] = $(elem).attr('href');
  });
  // Create a new array holding the full URLs to each statement,
  // using url.resolve to sort them out
  const fullUrls = linkPartials.map(linkPartial => url
  .resolve(mediaLandingUrl, encodeURI(linkPartial)));
  // Create an array of objects containing data extracted from
  // each media statement
  const statements = await fullUrls.map(async (fullUrl) => {
    try {
      // Fetch the statement page and wait for it to return
      const statementResponse = await goodGuy(fullUrl);
      // Load the statement body into Cheerio
      const $c = await Cheerio.load(statementResponse.body.toString());
      // Extract the article content element
      const article = await $c('div#article');
      // Extract the title text
      const title = article.find('h1').text();
      // Extract the raw date created text
      const rawDateString = article.find($c('div.newsCreatedDate')).text().trim();
      // Parse the date text into a proper Date object using moment.js and
      // the known formatting string
      const dateParsed = moment(rawDateString, 'D/MM/YYYY H:mm A');
      // Create a nice date string for use in the feed object
      const dateString = moment(dateParsed).format('dddd, D MMMM YYYY');
      // Create a more useful Unix epoch date (in seconds) for the feed object
      const dateUnix = moment(dateParsed).format('X');
      // Extract the media statement body text,
      // skipping the <ul> element at the top and the "Page Content" target link
      const contentHtml = article.find('div.article-content p');
      // Convert the Cheerio object to text, trim whitespace and reduce to 100 words
      // const contents = contentHtml.text().trim();
      const contents = contentHtml.text().trim().split(' ', 100).join(' ');
      // Return nice media statement data object
      return {
        url: fullUrl,
        dateString,
        dateUnix,
        title,
        contents,
      };
    } catch (error) {
      console.log('Fetch of statement info failed', error);
      throw error;
    }
  });
  // Wait for the all the Promise objects in this array to resolve
  const statementData = Promise.all(statements);
  // console.log('Statements obj = ');
  // console.dir(await statementData);
  // Hapi reply call to send back object data serialised to JSON
  reply(await statementData);
};
