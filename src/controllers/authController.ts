import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import Admin from '../models/Admin';
import { generateToken } from '../middlewares/auth';

const PROTECTED_EMAIL = 'philimuhire@gmail.com';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(admin.id);

    res.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingAdmin) {
      res.status(400).json({ success: false, message: 'Admin with this email already exists' });
      return;
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = req.admin;

    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(401).json({ success: false, message: 'Invalid Google token' });
      return;
    }

    const admin = await Admin.findOne({ where: { email: payload.email } });

    if (!admin) {
      res.status(403).json({ success: false, message: 'This email is not registered as an admin' });
      return;
    }

    if (!admin.googleId && payload.sub) {
      await admin.update({ googleId: payload.sub });
    }

    const token = generateToken(admin.id);

    res.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        token,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

export const listAdmins = async (_req: Request, res: Response): Promise<void> => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'name', 'email', 'createdAt'],
    });

    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('List admins error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      res.status(400).json({ success: false, message: 'Admin with this email already exists' });
      return;
    }

    const admin = await Admin.create({ email, name });

    res.status(201).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Add admin error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.params.id as string;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    if (admin.email === PROTECTED_EMAIL) {
      res.status(403).json({ success: false, message: 'This admin account cannot be removed' });
      return;
    }

    await admin.destroy();

    res.json({ success: true, message: 'Admin removed successfully' });
  } catch (error) {
    console.error('Remove admin error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
