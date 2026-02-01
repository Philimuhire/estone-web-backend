import { Request, Response } from 'express';
import Message from '../models/Message';
import { sendContactNotification } from '../services/emailService';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, message } = req.body;

    const newMessage = await Message.create({
      fullName,
      email,
      phone,
      message,
    });

    // Send email notification (don't fail if email fails)
    try {
      await sendContactNotification({ fullName, email, phone, message });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: {
        id: newMessage.id,
      },
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
