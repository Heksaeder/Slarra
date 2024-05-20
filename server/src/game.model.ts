import { Schema, model, Document } from 'mongoose';
import Joi from 'joi';


class GameClass {
  title: string;
  image: string;
  description: string;

  constructor(title: string, image: string, description: string) {
    this.title = title;
    this.image = image;
    this.description = description;
  }
}

export const gameValidate = Joi.object({
  title: Joi.string().max(50).required(),
  image: Joi.string().uri().optional(),
  description: Joi.string().max(300).optional()
});

export interface IGame extends Document {
  title: string;
  image: string;
  description: string;
}

const gameSchema = new Schema<IGame>({
  title: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String
  },
  description: { 
    type: String, 
    required: false 
  }
});

export const Game = model<IGame>('Game', gameSchema);