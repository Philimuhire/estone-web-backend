import { Request, Response } from 'express';
import { deleteImage, getPublicIdFromUrl } from '../config/cloudinary';

// Extended file type for Cloudinary uploads
interface CloudinaryFile extends Express.Multer.File {
  path: string; // Cloudinary URL
}

// @desc    Upload image (general)
// @route   POST /api/upload
// @access  Private (admin only)
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const file = req.file as CloudinaryFile;

    res.status(201).json({
      success: true,
      data: {
        url: file.path,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
// @access  Private (admin only)
export const deleteUploadedImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ success: false, message: 'Image URL is required' });
      return;
    }

    const publicId = getPublicIdFromUrl(imageUrl);

    if (!publicId) {
      res.status(400).json({ success: false, message: 'Invalid image URL' });
      return;
    }

    await deleteImage(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
