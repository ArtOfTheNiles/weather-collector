import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

// 📍 You Are Here: /api
router.use('/weather', weatherRoutes);

export default router;
