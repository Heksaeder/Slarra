// Message of a topic from a game forum
import { Schema, model, Document } from 'mongoose';
import Joi from 'joi';

export const messageValidate = Joi.object({
  content: Joi.string().max(65000).required(),
  userId: Joi.string().required(),
  topicId: Joi.string().required(),
  characterId: Joi.string().required()
});

export interface IMessage extends Document {
  content: string;
  userId: Schema.Types.ObjectId;
  topicId: Schema.Types.ObjectId;
  characterId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  characterId: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
});

export const Message = model<IMessage>('Message', messageSchema);