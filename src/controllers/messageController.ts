import { Request, Response } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 100));
    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
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
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const message = await Message.findByPk(id);

    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const message = await Message.findByPk(id);

    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    const { isRead } = req.body;
    message.isRead = isRead;
    await message.save();

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const message = await Message.findByPk(id);

    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
