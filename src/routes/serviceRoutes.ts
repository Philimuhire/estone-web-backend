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
import { publicCache } from '../middlewares/cache';
import { serviceValidators, idParamValidator } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', publicCache(300), getServices);
router.get('/:id', idParamValidator, validate, publicCache(300), getService);

// Protected routes (admin only)
router.post('/', protect, serviceValidators, validate, createService);
router.put('/:id', protect, idParamValidator, serviceValidators, validate, updateService);
router.delete('/:id', protect, idParamValidator, validate, deleteService);

export default router;
