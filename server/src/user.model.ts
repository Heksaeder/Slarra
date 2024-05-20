import { Schema, model, Document } from 'mongoose';
import Joi from 'joi';

const validRoles = [
  'admin',
  'user'
];

export const userValidate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid(...validRoles).default('user')
});

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio:string;
  role: string;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  bio: { 
    type: String, 
    required: false 
  },
  role: { 
    type: String, 
    enum: validRoles, 
    default: 'user' 
  }
});

export const User = model<IUser>('User', userSchema);