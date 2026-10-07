import express from 'express';
import { getMyComplaints, getAllStaff, updateStaffStatus } from '../controllers/staffController.js';

const router = express.Router();

router.get('/', getAllStaff);
router.get('/my-complaints', getMyComplaints);
router.put('/:id/status', updateStaffStatus);

export default router;
