import { Request, Response, NextFunction } from 'express';

// Adds Cache-Control headers to public, rarely-changing GET responses.
// Lets browsers/CDNs serve cached content and reduces database load.
export const publicCache = (maxAgeSeconds = 60) => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=300`);
    next();
  };
};
