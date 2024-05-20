import { User, IUser } from './user.model';
import e, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const SALT_ROUNDS = 10;

const SECRET_KEY = 'sl4rr4'

export class userService {
  async loginUser(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error('User not found');
      }

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        console.log('Compare both passwords', req.body.password, user.password);
        throw new Error('Incorrect password');
      }

      const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {expiresIn: '1h'});

      res.cookie('token', token, { 
        httpOnly: true, 
        secure: true,
        maxAge: 1000 * 60 * 60 // 1 hour
      });
      
      return {token, user};
    } catch (err) {
      console.error(err);
      throw new Error('Authentication failed');
    }
  }
  
  async registerUser(req: Request, res: Response) {
    try {
      const user = req.body;
      const userAttributes: IUser = req.body;
      const userEmail = await User.findOne({email: userAttributes.email});
      const username = await User.findOne({name: userAttributes.name});

      if(userAttributes.name.length < 3){
        return res.status(400).send('Name must be at least 3 characters long');
      } else if (!REGEX_EMAIL.test(userAttributes.email)) {
        return res.status(400).send('Invalid email');
      } else if (!REGEX_PASSWORD.test(userAttributes.password)) {
        return res.status(400).send('Password must be at least 8 characters long and contain at least one letter and one number');
      } else if (userEmail || username) {
        return res.status(400).send('Logs already in use');
      } else {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        const newUser = await User.create({ ...user, password: hashedPassword });
        return newUser;
      }
    }
    catch (err) {
      console.error(err);
      return res.status(500);
    }
  }

  async verifyUser(token: string) {
    try {
      const user = await User.findOne({ verifyToken: token });
      if (!user) {
        throw new Error('Invalid token');
      }
    } catch (err) {
      console.error(err);
      throw new Error('Verification failed');
    }
  }

  async getUsers() {
    try {
      return await User.find();
    }
    catch (err) {
      console.error(err);
    }
  }

  async getUserById(id: string) {
    try {
      return await User.findById(id);
    }
    catch (err) {
      console.error(err);
    }
  }

  async updateUser(id:string, updatedData: Partial<IUser>) {
    try {
      // Hash the password before saving
      if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, SALT_ROUNDS);
      }
      const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export const UserServices = new userService();