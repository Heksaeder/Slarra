import express from 'express';
import { body, validationResult } from 'express-validator';
import { GameController } from './game.ctrl';
import authMiddleware from './auth.middleware';
import characterRoutes from './character.route';
const gameRouter = express.Router();

// Validation and sanitization middlewares
const validateGame = [
  body('title').trim().isLength({ min: 3 }).escape().withMessage('Title must be at least 3 characters long'),
  body('description').optional().trim().escape(),
  body('image').optional().trim().isURL().withMessage('Image must be a valid URL')
];

gameRouter.post('/new', authMiddleware, validateGame, (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  GameController.createGame(req, res);
});

gameRouter.get('/all', authMiddleware, (req:any, res:any) => {
  if (req.userRole !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  GameController.getGames(req, res);
});

gameRouter.get('/:id', authMiddleware, GameController.getGameById);

gameRouter.put('/:id', authMiddleware, validateGame, (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  GameController.updateGame(req, res);
}
);

gameRouter.delete('/:id', authMiddleware, GameController.deleteGame);

gameRouter.use('/:gameId', characterRoutes)

export default gameRouter;