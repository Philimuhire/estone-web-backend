import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

interface JwtPayload {
  id: number;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d',
  });
};
