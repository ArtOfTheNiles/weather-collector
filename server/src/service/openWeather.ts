// Definitions from the OpenWeatherMap.org 'One-Call 3.0' API 
/* From the API page, as of 12-16-24, https://openweathermap.org/api/one-call-3:
>>  For temperature in Fahrenheit and wind speed in miles/hour, use units=imperial
>>  For temperature in Celsius and wind speed in meter/sec, use units=metric
>>  Temperature in Kelvin and wind speed in meter/sec is used by default, so there is no need to use the units parameter in the API call if you want this
*/

// #region ==== Interfaces ====
interface OwmWeather {
    // This is a common pattern in the OpenWeatherMap API
    id: number; // Condition codes, see: https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
    main: string; // Primary weather parameters (Rain, Sunny, Cloudy, etc)
    description: string; // A more verbose summary of the weather. Output is in request-defined language
    icon: string; // OpenWeatherMap.org icon codes, see: https://openweathermap.org/weather-conditions#How-to-get-icon-URL
}

interface CommonWeather {
    // These properties come up in multiple variations of the API call
    dt: number; // UTC
    pressure: number; // always in hectopascal (same as millibar)
    humidity: number; // Percentage, %
    dew_point: number; // Defined in request (default K°)
    uvi: number; // 1-10: normal, 11+ for extreme, has no upper limit
    clouds: number; // Percentage, %
    visibility: number; // always in meters, m
    wind_speed: number; // Defined in request (default meters per second)
    wind_deg: number; // Starting at 0° North going clockwise (90° East, 180° South, 270° West)
    wind_gust: number; // Defined in request (default meters per second)
    rain: number; // always in millimeters per hour, mm/h
    snow: number; // always in millimeters per hour, mm/h
    weather: OwmWeather;
}

interface BasicTemps {
    temp: number; // Defined in request (default K°)
    feels_like: number; // Defined in request (default K°)
}

interface MDEN {
    morn: number; // Temperature, morning
    day: number; // Temperature, midday
    eve: number; // Temperature, evening
    night: number; // Temperature, night
}

interface SunriseSunset {
    sunrise?: number; // UTC, Polar regions in constant day/night get no response
    sunset?: number; // UTC, Polar regions in constant day/night get no response
}

interface PoP {
    pop: number; // 'Probability of Precipitation', %
}

interface DailyTemps extends MDEN {
    min: number; // Minimum Daily Temperature
    max: number; // Maximum Daily Temperature
}

interface Current extends BasicTemps, CommonWeather, SunriseSunset {}

interface Minutely {
    dt: number; // UTC
    precipitation: number; // always in millimeters per hour, mm/h
}

interface Hourly extends BasicTemps, CommonWeather, PoP {}

interface Daily extends CommonWeather, SunriseSunset, PoP {
    moonrise?: number; // UTC
    moonset?: number; // UTC
    moon_phase: number; // 0-1 Range, 0/1 are 'new moon' and 0.5 is 'full moon'
    summary: string; // Human-readable description of the weather conditions for the day
    temp: DailyTemps;
    feels_like: MDEN;
}

interface Alerts {
    sender_name: string;
    event: string;
    start: number; // UTC
    end: number;
    description: string;
    tags: string;
}

// #endregion


export class Weather {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current?: Current;
    minutely?: Minutely;
    hourly?: Hourly;
    daily?: Daily;
    alerts?: Alerts;
    constructor (
        lat: number,
        lon: number,
        timezone: string,
        timezone_offset: number,
        current: Current,
        minutely: Minutely,
        hourly: Hourly,
        daily: Daily,
        alerts: Alerts
    ){
        this.lat = lat;
        this.lon = lon;
        this.timezone = timezone;
        this.timezone_offset = timezone_offset;
        this.current = current;
        this.minutely = minutely;
        this.hourly = hourly;
        this.daily = daily;
        this.alerts = alerts;
    }
}

export const weatherError: Weather = {
    lat: 0,
    lon: 0,
    timezone: 'ERR',
    timezone_offset: 0,
}

export default Weather;