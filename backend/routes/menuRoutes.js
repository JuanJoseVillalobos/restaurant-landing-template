import express from 'express';
import {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimitMiddleware.js';
import { validateObjectId, validateMenuItem } from '../middlewares/validateMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getMenuItems)
    .post(writeLimiter, protectAdmin, validateMenuItem(false), createMenuItem);

router.route('/:id')
    .get(validateObjectId, getMenuItemById)
    .put(writeLimiter, protectAdmin, validateObjectId, validateMenuItem(true), updateMenuItem)
    .delete(writeLimiter, protectAdmin, validateObjectId, deleteMenuItem);

export default router;
