import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { protect } from '../middlewares/auth';
import { uploadProject } from '../config/cloudinary';

const router = Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes (admin only) - with image upload
router.post('/', protect, uploadProject.single('image'), createProject);
router.put('/:id', protect, uploadProject.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
