import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define your secret key. Ideally, this should come from environment variables.
const SECRET_KEY = process.env.JWT_SECRET || 'sl4rr4';
const COOKIE_NAME = 'token';

// Extend the Request interface to include a userId property
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    userRole?: string;
  }
}

// Middleware function to authenticate the JWT
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string, exp: number, role:string };
    req.userId = decoded.id;
    req.userRole = decoded.role;

    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.exp || 0;
    const timeUntilExp = exp - now;
    const shouldRefresh = timeUntilExp < 180;

    if (shouldRefresh) {
      const newToken = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: '1h' });

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60, // 1 hour
      });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
