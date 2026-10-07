import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  reassignStaff,
  rerouteDepartment,
  recalculateAllPriorities,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.post('/recalculate-priorities', recalculateAllPriorities);

router.route('/:id')
  .get(getComplaintById)
  .put(updateComplaint);

router.put('/:id/reassign', reassignStaff);
router.put('/:id/reroute', rerouteDepartment);

export default router;
