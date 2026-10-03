import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  MAX_GALLERY_IMAGES,
} from '../controllers/projectController';
import { protect } from '../middlewares/auth';
import { publicCache } from '../middlewares/cache';
import { uploadProject } from '../config/cloudinary';

const router = Router();

// Public routes
router.get('/', publicCache(60), getProjects);
router.get('/:id', publicCache(60), getProject);

// Protected routes (admin only) - main image plus optional gallery images
const projectImages = uploadProject.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: MAX_GALLERY_IMAGES },
]);

router.post('/', protect, projectImages, createProject);
router.put('/:id', protect, projectImages, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
