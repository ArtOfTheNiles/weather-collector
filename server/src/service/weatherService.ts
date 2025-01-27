import dotenv from 'dotenv';
dotenv.config();

import Weather, { weatherError } from './openWeather.js';
import ForecastContainer from './forecast.interface.js';

interface Coordinates {
  lat: number;
  lon: number;
}

// Based on the Free OpenWeather API 2.5 (https://openweathermap.org/current) (no way that link doesn't break: 1-27-25)
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  constructor (){
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private blank:Coordinates = { lat: 0, lon: 0 };

  private async getWeather(coord: Coordinates):Promise<Weather> {
    try {
      const response = await fetch(
        `${this.baseURL}/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&units=imperial&appid=${this.apiKey}`
      )
      const inputWeather = await response.json();
      return inputWeather as Weather;
    } catch (error) {
      console.error(error);
      return error as Weather;
    }
  }

  private async getForecast(coord: Coordinates):Promise<ForecastContainer> {
    try {
      const response = await fetch(
        `${this.baseURL}/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=imperial&appid=${this.apiKey}`
      )
      const inputWeather = await response.json();
      return inputWeather as ForecastContainer;
    } catch (error) {
      console.error(error);
      return error as ForecastContainer;
    }
  }

  private async getCoordinatesByName(cityName: string): Promise<Coordinates> {
    if (!cityName) {
      console.error('City name required!');
      return this.blank;
    }

    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`
      );
      const locations = await response.json();
      // console.log("Location data received:", locations);

      if (!Array.isArray(locations) || locations.length === 0) {
        console.error('No location found!');
        return this.blank;
      }

      const location = locations[0];
      const coords: Coordinates = {
        lat: location.lat,
        lon: location.lon
      };
      
      console.info(`Geo Location: ${location.name} ${location.state}, ${location.country} at [${coords.lat}, ${coords.lon}]`);
      return coords;

    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return this.blank;
    }
  }

  private async getCoordinatesByZip(zip: string, _country_code?: string):Promise<Coordinates> {
    let requestLine = '';
    if(!zip){
      console.error('Zip code required!');
      return this.blank;
    }
    if(!_country_code){
      requestLine = `${zip},us`;
    }else{
      requestLine = `${zip},${_country_code}`;
    }
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/zip?zip=${requestLine}&appid=${this.apiKey}`
      )
      const location = await response.json();
      const coords: Coordinates = {
        lat: await Number.parseFloat(location.lat),
        lon: await Number.parseFloat(location.lon)
      }

      return coords;

    } catch (error) {
      console.error(error);
      return this.blank;
    }
  }

  public async getWeatherForCity(cityName: string):Promise<Weather>{
    try {
      let wReport: Weather = weatherError;
      const coords: Coordinates = await this.getCoordinatesByName(cityName);
      if(coords !== this.blank){
        wReport = await this.getWeather(coords);
        // console.info('Weather report: ', wReport);
      }
      return wReport;
    } catch (error) {
      console.error(error);
      return weatherError;
    }
  }

  public async getForecastForCity(cityName: string):Promise<ForecastContainer>{
    let outForecast: ForecastContainer = {} as ForecastContainer;
    try {
      const coords: Coordinates = await this.getCoordinatesByName(cityName);
      if(coords !== this.blank){
        outForecast = await this.getForecast(coords);
        console.info('Forecast report: ', outForecast);
      }
    } catch (error) {
      console.error(error);
    }
    return outForecast;
  }

  public async getWeatherForZipCode(zip: string):Promise<Weather>{
    try {
      let wReport: Weather = weatherError;
      const coords: Coordinates = await this.getCoordinatesByZip(zip);
      if(coords !== this.blank){
        wReport = await this.getWeather(coords);
      }
      return wReport;
    } catch (error) {
      console.error(error);
      return weatherError;
    }
  }

}

export default new WeatherService();
