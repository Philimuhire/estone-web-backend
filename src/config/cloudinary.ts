import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for different folders
const createStorage = (folder: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `escotech/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }],
    } as Record<string, unknown>,
  });
};

// Storage for different upload types
const projectStorage = createStorage('projects');
const teamStorage = createStorage('team');
const serviceStorage = createStorage('services');
const generalStorage = createStorage('general');

// Multer upload instances
export const uploadProject = multer({ storage: projectStorage });
export const uploadTeam = multer({ storage: teamStorage });
export const uploadService = multer({ storage: serviceStorage });
export const uploadGeneral = multer({ storage: generalStorage });

// Helper function to delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Image deleted: ${publicId}`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.ext
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // Get everything after 'upload/vXXX/' and remove extension
    const pathParts = parts.slice(uploadIndex + 2);
    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
    return publicId;
  } catch {
    return null;
  }
};

export default cloudinary;
