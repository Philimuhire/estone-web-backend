import { Router } from 'express';
import { login, register, getMe, googleLogin, listAdmins, addAdmin, removeAdmin } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginValidators, registerValidators, addAdminValidators, googleLoginValidators, idParamValidator } from '../utils/validators';

const router = Router();

router.post('/login', loginValidators, validate, login);
router.post('/google', googleLoginValidators, validate, googleLogin);
router.post('/register', protect, registerValidators, validate, register);
router.get('/me', protect, getMe);
router.get('/admins', protect, listAdmins);
router.post('/admins', protect, addAdminValidators, validate, addAdmin);
router.delete('/admins/:id', protect, idParamValidator, validate, removeAdmin);

export default router;
