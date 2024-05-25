import { TopicServices } from "./topic.srv";
import { Request, Response } from "express";
import { topicValidate } from "./topic.model";

class topicController {
  createTopic = async (req: Request, res: Response) => {
    try {
      console.log('req.body:', req.body)
      const { error } = topicValidate.validate({
        ...req.body,
        userId: req.userId,
        gameId: req.body.gameId,
      });
      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      const userId = req.userId;

      const topicAttributes = {
        ...req.body,
        userId,
      };

      const topic = await TopicServices.createTopic(topicAttributes);
      return res.status(201).send(topic);
    } catch (error) {
      res.status(500);
    }
  }

  getTopics = async (req: Request, res: Response) => {
    try {
      const topics = await TopicServices.getTopics();
      console.log('getTopics controller:', topics)
      res.status(200).json(topics);
    } catch (error) {
      res.status(500);
    }
  }

  getTopicById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const topic = await TopicServices.getTopicById(id as string);
      console.log('getTopicById controller:', topic)
      res.status(200).json(topic);
    } catch (error) {
      res.status(500);
    }
  }

  // Get all topics for a specific game created by the logged-in user
  getTopicsByGame = async (req: Request, res: Response) => {
    try {
      let { gameId } = req.params;
      if (!gameId) {
        gameId = req.query.gameId as string;
      }
      const topics = await TopicServices.getTopicsByGame(gameId as string);
      console.log('getTopicsByGame controller:', topics)
      res.status(200).json(topics);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }

  updateTopic = async (req: Request, res: Response) => {
    const data = {
      userId: req.body.userId,
      title: req.body.title,
      body: req.body.body,
      gameId: req.body.gameId,
    }

    try {
      const { error } = topicValidate.validate(data);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      
      const { id } = req.params;
      const topic = await TopicServices.updateTopic(id as string, req.body);
      res.status(200).json(topic);
    } catch (error) {
      res.status(500);
    }
  }
}

export const TopicController = new topicController();