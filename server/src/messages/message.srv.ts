import {Message, IMessage} from './message.model';
import {Request, Response} from 'express';

export class messageService {
  async createMessage(messageAttributes: IMessage) {
    const message = await Message.create(messageAttributes);
    return message;
  }

  async getMessages() {
    const messages = await Message.find();
    return messages;
  }

  async getMessageById(id: string) {
    const message = await Message.findById(id);
    return message;
  }

  async getMessagesByUser(userId: string) {
    const messages = await Message.find({ userId });
    return messages;
  }

  async getMessagesByTopic(topicId: string, skip: number, limit: number) {
    const messages = await Message.find({ topicId }).skip(skip).limit(limit);
    return messages;
  }

  async getMessagesByCharacter(characterId: string) {
    const messages = await Message.find({ characterId });
    return messages;
  }

  async updateMessage(id: string, updatedData: Partial<IMessage>) {
    updatedData.updatedAt = new Date();
    const message = await Message.findByIdAndUpdate(id, updatedData, { new: true });
    return message;
  }

  async deleteMessage(id: string) {
    const message = await Message.findByIdAndDelete(id);
    return message;
  }
}

export const MessageServices = new messageService();