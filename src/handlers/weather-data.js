import fs from 'fs';
import goodGuyHttp from 'good-guy-http';
import moment from 'moment';
import url from 'url';

let caFile = '';

if (process.env.NODE_ENV === 'production') {
  caFile = fs.readFileSync('/etc/pki/tls/cert.pem');
}

const goodGuy = goodGuyHttp({
  forceCaching: {
    timeToLive: 30000,
  },
  ca: caFile,
  headers: {
    'User-Agent': 'Department of Commerce Intranet - request',
  },
  json: true,
  proxy: process.env.HTTP_PROXY,
  timeout: 15000,
});

exports.getForecast = async function getWeather(request, reply) {
  const { location } = request.params;

  const locations = {
    perth: '2063523',
    cannington: '2075024',
  };

  const openWeatherMapEndPoint = url.format({
    protocol: 'https',
    hostname: 'api.openweathermap.org',
    pathname: 'data/2.5/forecast',
    query: {
      id: locations[location],
      mode: 'json',
      appid: process.env.OPENWEATHERMAP_API_KEY,
    },
  });

  try {
    // Get the featured status from the request parameter
    // const { featured } = request.params;
    const newsResponse = await goodGuy(openWeatherMapEndPoint);

    const forecasts = newsResponse.body.list.map(forecast => ({
      dateTime: moment.unix(forecast.dt).toISOString(),
      humidity: forecast.main.humidity,
      tempurate: forecast.main.temp,
      weather: forecast.weather[0].main,
      weather_id: forecast.weather[0].id,
    }));
    reply(forecasts);
  } catch (error) {
    console.error('Error fetching weather forecast.', error);
    reply(error.response.body);
  }
};
