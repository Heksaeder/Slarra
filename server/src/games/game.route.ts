import express from 'express';
import { body, validationResult } from 'express-validator';
import { GameController } from './game.ctrl';
import { checkToken } from '../utils/auth.middleware';
import characterRoutes from '../characters/character.route';
import topicRoutes from '../topics/topic.route';
const gameRouter = express.Router();

// Validation and sanitization middlewares
const validateGame = [
  body('title').trim().isLength({ min: 3 }).escape().withMessage('Title must be at least 3 characters long'),
  body('description').optional().trim().escape(),
  body('image').optional().trim().isURL().withMessage('Image must be a valid URL')
];

gameRouter.post('/new', checkToken, validateGame, (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  GameController.createGame(req, res);
});

gameRouter.get('/all', checkToken, GameController.getGames);

gameRouter.get('/:id', checkToken, GameController.getGameById);

gameRouter.put('/:id', checkToken, validateGame, (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  GameController.updateGame(req, res);
}
);

gameRouter.delete('/:id', checkToken, GameController.deleteGame);

gameRouter.use('/:gameId/characters', characterRoutes)
gameRouter.use('/:gameId/topics', topicRoutes)

export default gameRouter;