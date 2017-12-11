import Dotenv from 'dotenv';
import fs from 'fs';
import goodGuyHttp from 'good-guy-http';
import moment from 'moment';
import url from 'url';
import goodGuyCache from '../utils/good-guy-cache';
import locations from '../data/locations';

Dotenv.config();

let caFile = '';

if (process.env.NODE_ENV === 'production') {
  caFile = fs.readFileSync('/etc/pki/tls/cert.pem');
}

const goodGuy = goodGuyHttp({
  cache: goodGuyCache(2700),
  forceCaching: {
    cached: true,
    timeToLive: 2700000,
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

  const openWeatherMapEndPoint = url.format({
    protocol: 'https',
    hostname: 'api.openweathermap.org',
    pathname: 'data/2.5/forecast',
    query: {
      id: locations[location].weather,
      mode: 'json',
      appid: process.env.OPENWEATHERMAP_API_KEY,
    },
  });

  try {
    const newsResponse = await goodGuy(openWeatherMapEndPoint);

    const forecasts = newsResponse.body.list.map(forecast => ({
      dateTime: moment.unix(forecast.dt).toISOString(),
      humidity: forecast.main.humidity,
      temperature: forecast.main.temp,
      weather: forecast.weather[0].main,
      weather_id: forecast.weather[0].id,
    }));
    reply(forecasts);
  } catch (error) {
    console.error('Error fetching weather forecast.', error);
    reply(error.response.body);
  }
};
