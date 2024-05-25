import { MessageServices } from "./message.srv";
import { Request, Response } from "express";
import { messageValidate } from "./message.model";

class messageController {

  createMessage = async (req: Request, res: Response) => {
    try {
      const { error } = messageValidate.validate({
        ...req.body,
        userId: req.userId,
        topicId: req.body.topicId,
      });
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      
      const userId = req.userId;

      const messageAttributes = {
        ...req.body,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const message = await MessageServices.createMessage(messageAttributes);
      return res.status(201).send(message);
    } catch (error) {
      res.status(500);
    }
  }

  getMessages = async (req: Request, res: Response) => {
    try {
      const messages = await MessageServices.getMessages();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500);
    }
  }

  getMessagesByTopic = async (req: Request, res: Response, skip:number, limit:number) => {
    try {
      let { topicId } = req.params;
      if (!topicId) {
        topicId = req.query.topicId as string;
      }
      console.log('topicId:', topicId)
      const messages = await MessageServices.getMessagesByTopic(topicId as string, skip, limit);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500);
    }
  }

  getMessageById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const message = await MessageServices.getMessageById(id as string);
      res.status(200).json(message);
    } catch (error) {
      res.status(500);
    }
  
  }

  updateMessage = async (req: Request, res: Response) => {
    const data = {
      userId: req.body.userId,
      content: req.body.content,
      topicId: req.body.topicId,
      characterId: req.body.characterId,
    };

    try {
      const { error } = messageValidate.validate(data);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const { id } = req.params;
      const message = await MessageServices.updateMessage(id as string, req.body);
      res.status(200).json(message);
    } catch (error) {
      res.status(500);
    }
  }

  deleteMessage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await MessageServices.deleteMessage(id as string);
      res.status(204).send('Message deleted successfully');
    } catch (error) {
      res.status(500);
    }
  }
}

export const MessageController = new messageController();