import express from 'express';
import { loginAdmin } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

router.post('/login', authLimiter, loginAdmin);

export default router;

