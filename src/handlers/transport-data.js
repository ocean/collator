import Cheerio from 'cheerio';
import goodGuyHttp from 'good-guy-http';
import hash from '../hash';

const goodGuy = goodGuyHttp({
  forceCaching: {
    timeToLive: 30000,
  },
  headers: {
    'User-Agent': 'DMIRS Intranet Development - request',
  },
  proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

exports.getDepartures = async function getDepartures(request, reply) {
  const locations = {
    perth: {
      0: {
        station: 'Perth Station',
        url: 'http://www.transperth.wa.gov.au/Timetables/Live-Train-Times?stationname=Perth+Stn',
      },
      1: {
        station: 'Perth Underground Station',
        url: 'http://www.transperth.wa.gov.au/Timetables/Live-Train-Times?stationname=Perth+Underground+Stn',
      },
    },
    cannington: {
      0: {
        station: 'Cannington Station',
        url: 'http://www.transperth.wa.gov.au/Timetables/Live-Train-Times?stationname=Cannington+Stn',
      },
    },
  };

  // Get the location from the request parameter
  const { location } = request.params;
  // console.log('location=', location);

  // Find a station object associated with the location
  const stationObject = locations[location];
  // console.log('stationObject=', stationObject);

  // A station object could have one or more stations in it, this handles that
  const stationArray = Object.keys(stationObject);
  // Async function to wait for the info to be fetched and processed
  const departures = await stationArray.map(async (station) => {
    // console.dir(station);
    try {
      // Wait for good-guy to load the page from the URL
      const informationResponse = await goodGuy(stationObject[station].url);
      // Load the page body into Cheerio
      const $ = Cheerio.load(informationResponse.body.toString());
      // Extract the table rows showing train information
      const rowData = $('div.DNNModuleContent table tbody tr');
      // Create array for holding output data
      const times = [];
      // Iterate over each table row
      rowData.each((index, element) => {
        // Extract td elements from each row into an array
        const cellData = $(element).find('td');
        // Array for holding data for each row
        const info = [];
        // Iterate over each td element in the row
        cellData.each((idx, elem) => {
          // If this is the 3rd array value (containing the train stopping pattern info)
          // clean it up as it has lots of spaces and a linebreak in it
          if (idx === 2) {
            const split = $(elem).text().trim().split('\n');
            const cleaned = split.map(val => val.trim(), []);
            info[idx] = cleaned.join(' ');
          } else {
            // Put the trimmed text into array elements
            info[idx] = $(elem).text().trim();
          }
          // Possible plays with making an object instead.
        //   const departureTime = rowData[0].text().trim();
        //   console.log('departure time =', departureTime);
        //   const destination = rowData.eq(1).text().trim();
        //   console.log('destination =', destination);
        //   const description = rowData.eq(2).text().trim();
        //   console.log('description =', description);
        //   const status = rowData.eq(3).text().trim();
        //   console.log('status =', status);
        });
        // Add this row's data to the main output array
        times.push(info);
      });
      return times;
    } catch (error) {
      console.log('Fetch of statement info failed', error);
      throw error;
    }
  });
  // Wait for the all the Promise objects in this array to resolve
  const departureData = Promise.all(departures);

  // Hapi reply call to send back object data serialised to JSON
  reply(await departureData);
};


exports.getUpdates = async function getUpdates(request, reply) {
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
    reply(noticeData);
  } catch (error) {
    console.error('Error fetching Intranet news:', error);
  }
};
