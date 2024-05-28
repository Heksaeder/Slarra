import { Schema, model, Document } from 'mongoose';
import Joi from 'joi';

export const topicValidate = Joi.object({
  title: Joi.string().max(50).required(),
  userId: Joi.string().required(),
  body: Joi.string().max(12000).optional().empty(''),
  gameId: Joi.string().required()
});

export interface ITopic extends Document {
  title: string;
  body: string;
  userId: Schema.Types.ObjectId;
  gameId: Schema.Types.ObjectId;
}

const topicSchema = new Schema<ITopic>({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    default: ''
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  }
});

export const Topic = model<ITopic>('Topic', topicSchema);