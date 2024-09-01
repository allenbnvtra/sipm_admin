import express from 'express';
import {
  addNewTenant,
  getAllTenants,
  getTenant,
  getTenantBill,
} from '../controllers/tenantController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.get('/', getAllTenants);
router.post('/', addNewTenant);
router.get('/:tenantId', getTenant);
router.get('/:tenantId/bill', getTenantBill);

export default router;
