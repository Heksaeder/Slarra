import { Topic, ITopic } from './topic.model';
import { Request, Response } from 'express';


export class topicService {

  async createTopic(topicAttributes: ITopic) {
    const topicDB = await Topic.findOne({ title: topicAttributes.title });
    if (topicDB) {
      throw new Error('Topic already exists');
    }

    const topic = await Topic.create(topicAttributes);
    return topic;
  }

  async getTopics() {
    const topics = await Topic.find();
    return topics;
  }

  async getTopicById(id: string) {
    const topic = await Topic.findById(id);
    return topic;
  }

  async getTopicsByGame(gameId: string) {
    const topics = await Topic.find({ gameId: gameId});
    return topics;
  }

  async updateTopic(id: string, topicAttributes: ITopic) {
    const topic = await Topic.findByIdAndUpdate(id, topicAttributes, { new: true });
    return topic;
  }
}

export const TopicServices = new topicService();