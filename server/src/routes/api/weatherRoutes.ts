import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/:city', async (_req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  // TODO: This needs weather service completed!
  try {
    const cityWeather = WeatherService.getWeatherForCity(_req.params.city);
    res.json('Welcom to Weather');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await historyService.getCities();
    res.json(savedCities);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


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
