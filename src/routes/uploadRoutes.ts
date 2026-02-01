import { Router } from 'express';
import { uploadImage, deleteUploadedImage } from '../controllers/uploadController';
import { protect } from '../middlewares/auth';
import { uploadGeneral } from '../config/cloudinary';

const router = Router();

// Protected routes (admin only)
router.post('/', protect, uploadGeneral.single('image'), uploadImage);
router.delete('/', protect, deleteUploadedImage);

export default router;
