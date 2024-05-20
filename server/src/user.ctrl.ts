import { UserServices } from "./user.srv";
import { Request, Response } from "express";
import { userValidate } from "./user.model";

class userController {

  loginUser = async (req: Request, res: Response) => {
    try {
      const {token, user} = await UserServices.loginUser(req, res);
      console.log('token', token);
      res.cookie('token', token, { httpOnly: true, secure: true});
      return res.status(200).send({token, user});
    } catch (err) {
      return res.status(401);
    }
  }
  
  registerUser = async (req: Request, res: Response) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    
    const { error, value } = userValidate.validate(data);

    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      try {
        const user = await UserServices.registerUser(req, res);
        return res.status(201).send(user);
      } catch (err) {
        return res.status(500);
      }
    }
  }
  verifyUser = async (req: Request, res: Response) => {
    const token = req.body.token;

    if(!token) return res.status(400).send('Token not provided');
    else {
      try {
        const user = await UserServices.verifyUser(token);
        return res.status(200).send(user);
      } catch (err) {
        return res.status(401);
      }
    }
  }

  getUsers = async (req: Request, res: Response) => {
    const users = await UserServices.getUsers();
    return res.status(200).send(users);
  }

  getUserById = async (req: Request, res: Response) => {
    try {
      const user = await UserServices.getUserById(req.params.id);
      if(!user) return res.status(404).send('User not found');
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500);
    }
  }

  updateUser = async (req: Request, res: Response) => {
    try {
      const updatedUser = await UserServices.updateUser(req.params.id, req.body);
      if (!updatedUser) return res.status(404).send('User not found');
      return res.status(200).send(updatedUser);
    } catch (err) {
      return res.status(500);
    }
  }

  deleteUser = async (req: Request, res: Response) => {
    try {
      await UserServices.deleteUser(req.params.id);
      return res.status(204).send('User deleted');
    } catch (err) {
      return res.status(500);
    }
  }
  
}

export const UserController = new userController();