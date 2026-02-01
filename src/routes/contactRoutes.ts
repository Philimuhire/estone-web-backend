import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { validate } from '../middlewares/validate';
import { contactValidators } from '../utils/validators';

const router = Router();

router.post('/', contactValidators, validate, submitContact);

export default router;
