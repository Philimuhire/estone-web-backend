import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginValidators, registerValidators } from '../utils/validators';

const router = Router();

router.post('/login', loginValidators, validate, login);
router.post('/register', protect, registerValidators, validate, register);
router.get('/me', protect, getMe);

export default router;
