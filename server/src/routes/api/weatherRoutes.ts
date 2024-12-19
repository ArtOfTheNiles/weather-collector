import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// ERROR: Cannot POST /api/weather/

// 📍 You Are Here: /api/weather/(params)
router.post('/:cityName', async (req: Request, res: Response) => {
  try {
    console.log(`Made a POST in weather routes! Trying to get weather for ${req.params.cityName}`);
    historyService.addCity(req.params.cityName);
    const cityWeather = await WeatherService.getWeatherForCity(req.params.cityName);
    res.json(cityWeather);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// 📍 You Are Here: /api/weather/history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await historyService.getCities();
    res.json(savedCities);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// 📍 You Are Here: /api/weather/history/(params)
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if(!req.params.id){
      res.status(400).json({ msg: 'id of city is required' });
    }
    await historyService.removeCity(req.params.id);
    res.json({ success: 'Successfully removed entry from search history' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
