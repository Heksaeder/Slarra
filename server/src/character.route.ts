// routes/character.routes.ts
import express from 'express';
import { body, validationResult } from 'express-validator';
import { CharacterController } from './character.ctrl'; // Fix: Import CharacterController explicitly
import authMiddleware from './auth.middleware';

const router = express.Router({ mergeParams: true});

// Validation and sanitization middlewares
const validateCharacter = [
  body('name').trim().isLength({ min: 3 }).escape().withMessage('Name is required'),
  body('background').optional().trim().escape(),
  body('image').optional().trim().isURL().withMessage('Image must be a valid URL'),
  body('gameId').trim().isMongoId()
];


// Route to create a character
// Route to create a character
router.post('/new', authMiddleware, validateCharacter, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  CharacterController.createCharacter(req, res);
});

router.get('/all', authMiddleware, CharacterController.getCharactersByGame);
router.get('/:id', authMiddleware, CharacterController.getCharacterById);

router.put('/:id', authMiddleware, validateCharacter, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  CharacterController.updateCharacter(req, res);
});

router.delete('/:id', authMiddleware, CharacterController.deleteCharacter);

export default router;
