import rateLimit from 'express-rate-limit';

// Strict limiter for authentication endpoints.
// Protects against brute-force attacks and the CPU-bound login DoS vector.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});

// Limiter for the public contact form to prevent spam/abuse.
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions. Please try again later.',
  },
});
