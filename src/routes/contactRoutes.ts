import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { validate } from '../middlewares/validate';
import { contactLimiter } from '../middlewares/rateLimiter';
import { contactValidators } from '../utils/validators';

const router = Router();

router.post('/', contactLimiter, contactValidators, validate, submitContact);

export default router;
