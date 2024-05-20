import {Schema, model, Document} from 'mongoose';
import Joi from 'joi';


export const characterValidate = Joi.object({
  name: Joi.string().max(50).required(),
  image: Joi.string().uri().optional(),
  background: Joi.string().max(500).optional(),
  userId: Joi.string().required(),
  gameId: Joi.string().required()
});

export interface ICharacter extends Document {
  name: string;
  image: string;
  background: string;
  userId: Schema.Types.ObjectId;
  gameId: Schema.Types.ObjectId;
}

const characterSchema = new Schema<ICharacter>({
  name: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String
  },
  background: { 
    type: String
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

export const Character = model<ICharacter>('Character', characterSchema);