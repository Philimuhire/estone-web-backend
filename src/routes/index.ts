import { Router } from 'express';
import authRoutes from './authRoutes';
import contactRoutes from './contactRoutes';
import messageRoutes from './messageRoutes';
import projectRoutes from './projectRoutes';
import teamRoutes from './teamRoutes';
import serviceRoutes from './serviceRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/messages', messageRoutes);
router.use('/projects', projectRoutes);
router.use('/team', teamRoutes);
router.use('/services', serviceRoutes);
router.use('/upload', uploadRoutes);

export default router;
