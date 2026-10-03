import { Request, Response } from 'express';
import Project from '../models/Project';
import { deleteImage, getPublicIdFromUrl } from '../config/cloudinary';

interface CloudinaryFile extends Express.Multer.File {
  path: string;
}

export const MAX_GALLERY_IMAGES = 3;

interface ProjectUploads {
  image?: CloudinaryFile[];
  gallery?: CloudinaryFile[];
}

const getUploads = (req: Request): ProjectUploads => (req.files || {}) as ProjectUploads;

const deleteImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map((url) => {
      const publicId = getPublicIdFromUrl(url);
      return publicId ? deleteImage(publicId) : Promise.resolve();
    })
  );
};

/**
 * `keepGallery` is a JSON array of the existing gallery URLs the admin left in place.
 * When it is absent the gallery is left untouched, so older clients that only send
 * the main image keep working. Unknown URLs are ignored rather than trusted.
 */
const parseKeepGallery = (raw: unknown, current: string[]): string[] | null => {
  if (raw === undefined) return current;
  try {
    const parsed: unknown = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return null;
    return current.filter((url) => parsed.includes(url));
  } catch {
    return null;
  }
};

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

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    const { count, rows } = await Project.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      count: rows.length,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

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

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, location, featured } = req.body;
    const uploads = getUploads(req);
    const imageFile = uploads.image?.[0];
    const galleryUrls = (uploads.gallery || []).map((file) => file.path);

    if (!imageFile) {
      await deleteImages(galleryUrls);
      res.status(400).json({ success: false, message: 'Image is required' });
      return;
    }

    if (!title || !description || !category || !location) {
      await deleteImages([imageFile.path, ...galleryUrls]);
      res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and location'
      });
      return;
    }

    const project = await Project.create({
      title,
      description,
      category,
      location,
      image: imageFile.path,
      gallery: galleryUrls,
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

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const { title, description, category, location, featured, keepGallery } = req.body;
    const uploads = getUploads(req);
    const imageFile = uploads.image?.[0];
    const newGalleryUrls = (uploads.gallery || []).map((file) => file.path);
    const newUploads = [...(imageFile ? [imageFile.path] : []), ...newGalleryUrls];

    const currentGallery = project.gallery || [];
    const keptGallery = parseKeepGallery(keepGallery, currentGallery);

    if (keptGallery === null) {
      await deleteImages(newUploads);
      res.status(400).json({ success: false, message: 'keepGallery must be a JSON array of image URLs' });
      return;
    }

    const gallery = [...keptGallery, ...newGalleryUrls];
    if (gallery.length > MAX_GALLERY_IMAGES) {
      await deleteImages(newUploads);
      res.status(400).json({
        success: false,
        message: `A project can have at most ${MAX_GALLERY_IMAGES} gallery images`,
      });
      return;
    }

    const replacedImages = [
      ...(imageFile ? [project.image] : []),
      ...currentGallery.filter((url) => !keptGallery.includes(url)),
    ];

    await project.update({
      title: title || project.title,
      description: description || project.description,
      category: category || project.category,
      location: location || project.location,
      image: imageFile ? imageFile.path : project.image,
      gallery,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : project.featured,
    });

    // Only remove old files once the record no longer points at them.
    await deleteImages(replacedImages);

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await Project.findByPk(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    await project.destroy();
    await deleteImages([project.image, ...(project.gallery || [])]);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
