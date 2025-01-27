import dotenv from 'dotenv';
dotenv.config();

import Weather, { weatherError } from './openWeather.js';

interface Coordinates {
  lat: number;
  lon: number;
}

// Based on the OpenWeather API 3.0 (https://openweathermap.org/api/one-call-3)
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private excludes = [
    // 'current',
    'minutely',
    // 'hourly',
    // 'daily',
    'alerts'
  ]
  constructor (){
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private blank:Coordinates = { lat: 0, lon: 0 };

  private async getWeather(coord: Coordinates){
    try {
      const response = await fetch(
        `${this.baseURL}/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=${this.excludes.join(',')}&appid=${this.apiKey}`
      )
      const inputWeather = await response.json();
      return inputWeather as Weather;
    } catch (error) {
      console.error(error);
      return error as Weather;
    }
  }

  private async getCoordinatesByName(cityName: string, state_code?: string, country_code?: string):Promise<Coordinates> {
    let requestLine = '';
    if(state_code){
      requestLine = `${cityName},${state_code},us`;
    }else if (!country_code){
      requestLine = `${cityName}`;
    }else{
      requestLine = `${cityName},${country_code}`;
    }
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${requestLine}&limit=1&appid=${this.apiKey}`
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
      }
      return wReport;
    } catch (error) {
      console.error(error);
      return weatherError;
    }
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
