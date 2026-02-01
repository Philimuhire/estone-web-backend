import { Request, Response } from 'express';
import Service from '../models/Service';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.findAll({
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const service = await Service.findByPk(id);

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private (admin only)
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, features, icon, order } = req.body;

    const service = await Service.create({
      title,
      description,
      features,
      icon,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (admin only)
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const service = await Service.findByPk(id);

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    const { title, description, features, icon, order } = req.body;

    await service.update({
      title,
      description,
      features,
      icon,
      order,
    });

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (admin only)
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const service = await Service.findByPk(id);

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    await service.destroy();

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
