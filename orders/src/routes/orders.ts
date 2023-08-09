import express from 'express';
import { protect, validateId } from '@ipassternak-gittix/common-lib';
import { createOne } from '../controllers/create';
import { deleteOne } from '../controllers/delete';
import { getAll, getOne } from '../controllers/get';

const router = express.Router();

router.use(protect);

router.param('id', validateId);

router.route('/api/orders').get(getAll).post(createOne);
router.route('/api/orders/:id').get(getOne).delete(deleteOne);

export { router as ordersRouter };
