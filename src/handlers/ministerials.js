import Boom from 'boom';
import Cheerio from 'cheerio';
import goodGuyHttp from 'good-guy-http';
import { flattenDeep, uniqBy } from 'lodash';
import moment from 'moment';
import url from 'url';
import goodGuyCache from '../utils/good-guy-cache';
import hash from '../utils/hash';

const mediaLandingUrls = [
  'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Commerce-and-Industrial-Relations.aspx',
  'https://www.mediastatements.wa.gov.au/Pages/Portfolios/Mines-and-Petroleum.aspx',
];

const goodGuy = goodGuyHttp({
  cache: goodGuyCache(1800),
  cacheResponseTimeout: 700,
  forceCaching: {
    cached: true,
    timeToLive: 1800 * 1000,
  },
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

exports.getMinisterials = async function getMinisterials(request, reply) {
  try {
    const portfolio = mediaLandingUrls.map(async (mediaLandingUrl) => {
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
        // Create a simple ISO 8601 date and time string for use in the feed object
        const dateTime = moment(dateParsed).format();
        // Extract the media statement body text,
        // skipping the <ul> element at the top and the "Page Content" target link
        const contentHtml = article.find('div.article-content p');
        // Convert the Cheerio object to text, trim whitespace and reduce to 100 words
        const contents = contentHtml.text().trim().split(' ', 100).join(' ');
        // Return nice media statement data object
        return {
          url: fullUrl,
          dateTime,
          title,
          contents,
          type: 'statement',
          source: 'ministerial',
          author: 'minister',
          id: hash.generate(title),
        };
      });
      // Wait for the all the Promise objects in this array to resolve
      const statementData = await Promise.all(statements);
      // Hapi reply call to send back object data serialised to JSON
      return statementData;
    });
    // Wait for the all the Promise objects in this array to resolve
    const allStatements = await Promise.all(portfolio);
    // Our promise comes back as 2 nested arrays, flatten it
    const flattened = flattenDeep(allStatements);
    // Sort the items by published date, most recent first
    flattened.sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime));
    // Remove any duplicate items (due to portfolio crossover)
    // (Note: uses hash which is calculated from item title)
    const deduped = uniqBy(flattened, 'id');
    // Hapi reply call to send back object data serialised to JSON
    reply(deduped);
  } catch (error) {
    Boom.boomify(error);
    request.error('Fetch of media statements failed', error);
    reply(error);
  }
};
