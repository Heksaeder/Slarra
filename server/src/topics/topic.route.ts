import express from 'express';
import { TopicController } from './topic.ctrl';
import { checkToken } from '../utils/auth.middleware';
import { body, validationResult } from 'express-validator';
import messageRoutes from '../messages/message.route';

const router = express.Router({ mergeParams: true });

const validateTopic = [
  body('title').trim().isLength({ min: 3 }).escape().withMessage('Title is required'),
  body('body').trim().isLength({ max: 120 }).escape().withMessage('Body must be less than 120 characters'),
  body('gameId').trim().isMongoId().withMessage('Game ID is required')
];

router.post('/new', checkToken, validateTopic, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  TopicController.createTopic(req, res);
});

router.get('/all', checkToken, (req:any, res:any) => {
  let gameId = req.gameId;
  if (!gameId) {
    gameId = req.query.gameId as string;
  }
  TopicController.getTopicsByGame(req, res);
});

router.get('/:id', checkToken, TopicController.getTopicById);

router.put('/:id', checkToken, validateTopic, TopicController.updateTopic);

router.use('/:topicId/posts', messageRoutes);

export default router;