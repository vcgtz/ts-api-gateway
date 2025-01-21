import { Request, Response, NextFunction, Express } from 'express';
import { HTTP_CODES } from '../types/http';

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const { isAuthenticated } = req.session;

  if (!isAuthenticated) {
    res.sendStatus(HTTP_CODES.UNAUTHORIZED);
  } else {
    next();
  }
}
