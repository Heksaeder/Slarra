import express from 'express';
import { body, validationResult } from 'express-validator';

import { UserController } from './user.ctrl';
import authMiddleware from './auth.middleware';
const userRouter = express.Router();

const validateUser = [
  body('name').trim().isLength({min:3}).escape().withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({min:8}).escape().withMessage('Password must be at least 8 characters long')
];
// Register user
userRouter.post('/new', validateUser, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  UserController.registerUser(req, res);
});

// Login user
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).escape().withMessage('Password must be at least 8 characters long')
];

userRouter.post('/login', loginValidation, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  UserController.loginUser(req, res);
});

userRouter.get('/:id', authMiddleware, UserController.getUserById);

userRouter.get('/', authMiddleware, UserController.getUsers);

// Update user
userRouter.put('/:id', authMiddleware, validateUser, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  UserController.updateUser(req, res);
});

// DELETE /users/:id
userRouter.delete('/:id', authMiddleware, UserController.deleteUser);

export default userRouter;