import express from 'express';
import { protect, validateId } from '@ipassternak-gittix/common-lib';
import { createOne } from '../controllers/create';
import { getAll, getOne } from '../controllers/get';
import { updateOne } from '../controllers/update';

const router = express.Router();

router.param('id', validateId);

router.route('/api/tickets').get(getAll).post(protect, createOne);
router.route('/api/tickets/:id').get(getOne).put(protect, updateOne);

export { router as ticketsRouter };
