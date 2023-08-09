import express from 'express';
import { currentUser } from '../controllers/current-user';
import { signin } from '../controllers/signin';
import { signout } from '../controllers/signout';
import { signup } from '../controllers/signup';

const router = express.Router();

router.get('/api/users/current-user', currentUser);
router.post('/api/users/signin', signin);
router.post('/api/users/signout', signout);
router.post('/api/users/signup', signup);

export { router as authRouter };
