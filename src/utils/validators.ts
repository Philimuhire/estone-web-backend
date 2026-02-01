import { body, param } from 'express-validator';

// Contact form validators
export const contactValidators = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
];

// Auth validators
export const loginValidators = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const registerValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Project validators
export const projectValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['residential', 'commercial'])
    .withMessage('Category must be either residential or commercial'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
];

// Team member validators
export const teamMemberValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isLength({ max: 100 })
    .withMessage('Role must not exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  body('isCEO')
    .optional()
    .isBoolean()
    .withMessage('isCEO must be a boolean'),
];

// Service validators
export const serviceValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('features')
    .isArray()
    .withMessage('Features must be an array'),
  body('features.*')
    .trim()
    .notEmpty()
    .withMessage('Each feature must be a non-empty string'),
  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Icon is required'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

// ID param validator
export const idParamValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid ID'),
];

// Message status validator
export const messageStatusValidator = [
  body('isRead')
    .isBoolean()
    .withMessage('isRead must be a boolean'),
];
