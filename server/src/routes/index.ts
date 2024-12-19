import { Router } from 'express';
const router = Router();

import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

// 📍 You Are Here: ______
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;
