import { Router } from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { serviceValidators, idParamValidator } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', getServices);
router.get('/:id', idParamValidator, validate, getService);

// Protected routes (admin only)
router.post('/', protect, serviceValidators, validate, createService);
router.put('/:id', protect, idParamValidator, serviceValidators, validate, updateService);
router.delete('/:id', protect, idParamValidator, validate, deleteService);

export default router;
