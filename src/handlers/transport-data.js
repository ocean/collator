import Cheerio from 'cheerio';
import goodGuyHttp from 'good-guy-http';

const goodGuy = goodGuyHttp({
  defaultCaching: {
    timeToLive: 30000,
  },
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
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

  const location = request.params.location;
  // console.log('location=', location);

  const stationObject = locations[location];
  // console.log('stationObject=', stationObject);

  // const departures = [];

  const stationArray = Object.keys(stationObject);
  // for (station in stationObject) {
  // stationArray.each()
  const departures = await stationArray.map(async (station) => {
    // console.dir(station);
    try {
      const informationResponse = await goodGuy(stationObject[station].url);
      // Load the page body into Cheerio
      const $ = Cheerio.load(informationResponse.body.toString());
      // Extract the table rows showing train information
      const rowData = $('div.DNNModuleContent table tbody tr');
      // const times = [];
      rowData.each((index, element) => {
        // console.log($(element));
        const cellData = $(element).find('td');
        // console.log(rowData.text());
        const testarr = [];
        cellData.each((idx, elem) => {
          // console.log($(elem).text());
          testarr.push($(elem).text().trim());
        //   const departureTime = rowData[0].text().trim();
        //   console.log('departure time =', departureTime);
        //   const destination = rowData.eq(1).text().trim();
        //   console.log('destination =', destination);
        //   const description = rowData.eq(2).text().trim();
        //   console.log('description =', description);
        //   const status = rowData.eq(3).text().trim();
        //   console.log('status =', status);
          // console.log(testarr);
        });
        console.log(testarr);
      });
      // console.dir(rawTimes.first().html());
      // // Extract the media statement body text,
      // // skipping the <ul> element at the top and the "Page Content" target link
      // const contentHtml = article.find('div.article-content p');
      // // Convert the Cheerio object to text, trim whitespace and reduce to 100 words
      // // const contents = contentHtml.text().trim();
      // const contents = contentHtml.text().trim().split(' ', 100).join(' ');
      // // Return nice media statement data object
      // return {
      //   url: fullUrl,
      //   dateString,
      //   dateUnix,
      //   title,
      //   contents,
      // };
      return rowData.text();
      // departures.push(rawTimes.text());
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
