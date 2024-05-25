import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define your secret key. Ideally, this should come from environment variables.
const SECRET_KEY = process.env.JWT_SECRET || 'sl4rr4';

// Extend the Request interface to include a userId property
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    userRole?: string;
  }
}

// Function to generate a JWT
const generateToken = (payload: any) => {
  console.log('payload:', payload)
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
}

const setToken = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 // 1 hour
  });
}

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    req.userId = (decoded as { id: string }).id;
    req.userRole = (decoded as { role: string }).role;
    
    const decodedToken = decoded as { id: string, role: string, exp: number};
    const exp = decodedToken.exp * 1000;
    const now = Date.now();
    const timeLeft = exp - now;
    const threshold = 5 * 60 * 1000;

    if(timeLeft > threshold) { // token is still valid
      return next();
    } else if (timeLeft <= threshold && timeLeft > 0) { // token is about to expire
      console.log('REFRESH');
      const newToken = generateToken({ id: decodedToken.id, role: decodedToken.role});
      console.log('newToken:', newToken);
      setToken(res, newToken);
      next();
    } else {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  });

}

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

export {
  adminMiddleware, 
  checkToken, 
  generateToken, 
  setToken
};
