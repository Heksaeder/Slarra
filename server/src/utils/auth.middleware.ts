import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define your secret key. Ideally, this should come from environment variables.
const SECRET_KEY = process.env.JWT_SECRET || 'sl4rr4';

// Extend the Request interface to include a userId property
declare module 'express-serve-static-core' {
  interface Request {
    userId: string;
    userRole: string;
  }
}

// Function to generate a JWT
const generateToken = (payload: any) => {
  console.log('payload:', payload);
  const exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1h
  const finalPayload = {...payload, exp};
  return jwt.sign(finalPayload, SECRET_KEY);
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
      return res.sendStatus(401);
    }

    req.userId = (decoded as { id: string }).id;
    req.userRole = (decoded as { role: string }).role;

    console.log('req.userId:', req.userId);
    console.log('req.userRole:', req.userRole);

    const decodedToken = decoded as { exp: number; role:string, id: string };
    const expiration = decodedToken.exp * 1000;
    const now = Date.now();
    const delay = 10 * 60 * 1000;

    if (expiration <= now) {
      console.log("token expired");
      return res.status(401).json({ message: 'Token expired.' });
    } else if ((expiration - now) <= delay) {
      // Generate a new token with a new expiration time
      const newToken = generateToken(decodedToken);
      console.log("new token: " + newToken);

      // Set the new token in a secure cookie
      res.cookie('token', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000
      });

      // Ensure that next() is called after the cookie is set and userId is attached
      res.setHeader('Set-Cookie', 'token=' + newToken + '; HttpOnly; Secure; SameSite=Strict; Max-Age=3600');
    }

    console.log("no need to refresh token");
    next();
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
