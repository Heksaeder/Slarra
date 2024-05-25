import express from 'express';
import { MessageController } from './message.ctrl';
import { checkToken } from '../utils/auth.middleware';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateMessage = [
  body('content').trim().isLength({ min: 3 }).escape().withMessage('Message body is required'),
  body('topicId').trim().isMongoId().withMessage('Topic ID is required')
];

router.post('/new', checkToken, validateMessage, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  MessageController.createMessage(req, res);
});

router.get('/all', checkToken, (req:any, res:any) => {
  const {page = 1, limit = 10} = req.query;
  const skip = (page - 1) * limit;
  let topicId = req.params.topicId;
  console.log('topicId (params)', topicId)
  if (!topicId) {
    topicId = req.query.topicId as string;
    console.log('topicId (query)', topicId)
  }
  MessageController.getMessagesByTopic(req, res, skip, limit);
});

router.get('/:id', checkToken, MessageController.getMessageById);

router.put('/:id', checkToken, validateMessage, (req:any, res:any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  MessageController.updateMessage(req, res);
});

router.delete('/:id', checkToken, MessageController.deleteMessage);

export default router;