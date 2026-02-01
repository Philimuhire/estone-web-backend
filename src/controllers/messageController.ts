import { Request, Response } from 'express';
import Message from '../models/Message';

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (admin only)
export const getMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private (admin only)
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

// @desc    Update message status (mark as read/unread)
// @route   PATCH /api/messages/:id
// @access  Private (admin only)
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

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (admin only)
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
