import { Request, Response } from 'express';
import TeamMember from '../models/TeamMember';
import { deleteImage, getPublicIdFromUrl } from '../config/cloudinary';

interface CloudinaryFile extends Express.Multer.File {
  path: string;
}

export const getTeamMembers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const members = await TeamMember.findAll({
      order: [
        ['isCEO', 'DESC'],
        ['order', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const member = await TeamMember.findByPk(id);

    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found' });
      return;
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, description, order, isCEO } = req.body;

    if (!req.file) {
      res.status(400).json({ success: false, message: 'Image is required' });
      return;
    }

    const file = req.file as CloudinaryFile;
    const image = file.path;

    const member = await TeamMember.create({
      name,
      role,
      description,
      image,
      order: order ? parseInt(order) : 0,
      isCEO: isCEO === 'true' || isCEO === true,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const member = await TeamMember.findByPk(id);

    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found' });
      return;
    }

    const { name, role, description, order, isCEO } = req.body;

    let image = member.image;
    if (req.file) {
      const file = req.file as CloudinaryFile;

      const oldPublicId = getPublicIdFromUrl(member.image);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }

      image = file.path;
    }

    await member.update({
      name: name || member.name,
      role: role || member.role,
      description: description || member.description,
      image,
      order: order !== undefined ? parseInt(order) : member.order,
      isCEO: isCEO !== undefined ? (isCEO === 'true' || isCEO === true) : member.isCEO,
    });

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const member = await TeamMember.findByPk(id);

    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found' });
      return;
    }

    const publicId = getPublicIdFromUrl(member.image);
    if (publicId) {
      await deleteImage(publicId);
    }

    await member.destroy();

    res.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
