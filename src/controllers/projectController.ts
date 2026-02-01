import { Request, Response } from 'express';
import Project from '../models/Project';
import { deleteImage, getPublicIdFromUrl } from '../config/cloudinary';

// Extended file type for Cloudinary uploads
interface CloudinaryFile extends Express.Multer.File {
  path: string;
}

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured } = req.query;
    const where: Record<string, unknown> = {};

    if (category && (category === 'residential' || category === 'commercial')) {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const projects = await Project.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (admin only)
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    // Debug logging
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { title, description, category, location, featured } = req.body;

    // Get image URL from uploaded file
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Image is required' });
      return;
    }

    // Validate required fields
    if (!title || !description || !category || !location) {
      res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and location'
      });
      return;
    }

    const file = req.file as CloudinaryFile;
    const image = file.path;

    const project = await Project.create({
      title,
      description,
      category,
      location,
      image,
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (admin only)
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const { title, description, category, location, featured } = req.body;

    // Check if new image was uploaded
    let image = project.image;
    if (req.file) {
      const file = req.file as CloudinaryFile;

      // Delete old image from Cloudinary
      const oldPublicId = getPublicIdFromUrl(project.image);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }

      image = file.path;
    }

    await project.update({
      title: title || project.title,
      description: description || project.description,
      category: category || project.category,
      location: location || project.location,
      image,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : project.featured,
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (admin only)
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Delete image from Cloudinary
    const publicId = getPublicIdFromUrl(project.image);
    if (publicId) {
      await deleteImage(publicId);
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
