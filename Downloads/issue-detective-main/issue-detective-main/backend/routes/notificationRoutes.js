import express from 'express';
import { getNotifications, markNotificationsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getNotifications);
router.put('/read-all', markNotificationsRead);

export default router;

