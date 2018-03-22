import Boom from 'boom';
import Cheerio from 'cheerio';
import goodGuyHttp from 'good-guy-http';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import Moment from 'moment';
import goodGuyCache from '../utils/good-guy-cache';
import hash from '../utils/hash';
import locations from '../data/locations';

const goodGuy = goodGuyHttp({
  cache: goodGuyCache(30),
  forceCaching: {
    cached: true,
    timeToLive: 30000,
  },
  headers: {
    'User-Agent': 'DMIRS Intranet Development - request',
  },
  proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

exports.getDepartures = async function getDepartures(request, h) {
  // Get the location from the request parameter
  const { location } = request.params;

  // Find a station object associated with the location
  const stationObject = locations[location].transport;

  // A station object could have one or more stations in it, this handles that
  const stationArray = Object.keys(stationObject);

  // Async function to wait for the info to be fetched and processed

  const now = Moment().format('YYYY-MM-DD');

  const departures = await stationArray.map(async (station) => {
    try {
      // Wait for good-guy to load the page from the URL
      const informationResponse = await goodGuy(stationObject[station].url);
      // Load the page body into Cheerio
      const $ = Cheerio.load(informationResponse.body.toString());
      // Extract the table rows showing train information
      const rowData = $('div.DNNModuleContent table tbody tr');
      // Create array for holding output data

      // Iterate over each table row
      const trainTimes = rowData.map((index, element) => {
        // We don't want the last row in each table.
        if (index < rowData.length - 1) {
          const train = $(element).find('td');

          const departureTime = `${now}T${train.eq(0).text().trim()}:00+08:00`;
          const destination = train.eq(1).text().replace('To', '').trim();
          const description = train.eq(2).text().split('\n')
            .map(val => val.trim(), [])
            .join(' ')
            .trim();
          const status = train.eq(3).text().trim();
          const id = hash.generate(departureTime + destination);

          return {
            id,
            departureTime,
            destination,
            description,
            status,
          };
        }
        // if last item return null (basically break...unless you can break in JS.)
        return null;
      }).get();

      return trainTimes;
    } catch (error) {
      Boom.boomify(error);
      request.error('Fetch of train departure times failed', error);
      throw error;
    }
  });
  // Wait for the all the Promise objects in this array to resolve
  const departureData = await Promise.all(departures);
  // Hapi reply call to send back object data serialised to JSON
  return h.response(await sortBy(flatten(departureData), 'departureTime')).code(200);
};


exports.getUpdates = async function getUpdates(request, h) {
  const serviceUpdatesUrl = 'http://www.transperth.wa.gov.au/service-updates/train-updates';
  try {
    // Fetch the service updates page and wait for it to return
    const serviceResponse = await goodGuy(serviceUpdatesUrl);
    // Load the HTML body into Cheerio
    const $ = Cheerio.load(serviceResponse.body.toString());
    // Extract the data from the table of train service disruptions
    const serviceNotices = $('#EDN_Transperth table');
    // Get an array of the link elements (knock off the last item as it is not needed :) )
    const noticeLinks = serviceNotices.find('a').slice(0, -1);
    // Iterate over each link
    const noticeData = noticeLinks
      .map((index, element) => {
        const notice = $(element);
        // Extract the title text
        const title = notice.text();
        // Extract the url
        const url = notice.attr('href');
        // Generate a unique id
        const id = hash.generate(title);
        return { id, title, url };
      })
      .get();

    // Hapi reply call to send back object data serialised to JSON
    return h.response(noticeData).code(200);
  } catch (error) {
    Boom.boomify(error);
    request.error('Error fetching train service updates', error);
    throw error;
  }
};
