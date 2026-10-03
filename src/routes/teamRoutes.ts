import { Router } from 'express';
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController';
import { protect } from '../middlewares/auth';
import { publicCache } from '../middlewares/cache';
import { uploadTeam } from '../config/cloudinary';

const router = Router();

// Public routes
router.get('/', publicCache(300), getTeamMembers);
router.get('/:id', publicCache(300), getTeamMember);

// Protected routes (admin only) - with image upload
router.post('/', protect, uploadTeam.single('image'), createTeamMember);
router.put('/:id', protect, uploadTeam.single('image'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

export default router;
