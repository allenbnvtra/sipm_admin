import express from 'express';
import {
  getAllTenants,
  getTenant,
  getTenantBill,
} from '../controllers/tenantController.js';

const router = express.Router();

router.get('/', getAllTenants);
router.get('/:tenantId', getTenant);
router.get('/:tenantId/bill', getTenantBill);

export default router;
