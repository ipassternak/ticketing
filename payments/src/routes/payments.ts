import express from 'express';
import { protect } from '@ipassternak-gittix/common-lib';
import { charge } from '../controllers/charge';

const router = express.Router();

// body('token') body('orderId')

router.post('/api/payments', protect, charge);

export { router as paymentsRouter };
