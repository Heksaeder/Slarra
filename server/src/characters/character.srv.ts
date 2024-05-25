import { Character, ICharacter } from './character.model';
import { Request, Response } from 'express';

export class characterService {
  async createCharacter(characterAttributes: ICharacter) {
    const characterDB = await Character.findOne({ name: characterAttributes.name });
    if (characterDB) {
      throw new Error('Character already exists');
    }
    const character = await Character.create(characterAttributes);
    return character;
  }

  async getCharacters() {
    const characters = await Character.find();
    return characters;
  }

  async getCharacterById(id: string) {
    const character = await Character.findById(id);
    return character;
  }

  async getCharactersByGame(gameId: string, userId: string) {
    const characters = await Character.find({ gameId, userId });
    return characters;
  }

  async updateCharacter(req: Request, res: Response) {
    try {
      const char = await Character.findById(req.params.id);
      if (!char) {
        return res.status(404).send('Character not found');
      }

      if (char.userId.toString() !== req.userId) {
        return res.status(401).send('Unauthorized');
      }

      if (char.gameId.toString() !== req.body.gameId) {
        return res.status(401).send('Unauthorized');
      }

      const characterAttributes: ICharacter = req.body;
      const character = await Character.findByIdAndUpdate(req.params.id, characterAttributes, {new: true});
      return res.status(200).send(character);
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  }

  async deleteCharacter(id: string) {
    const character = await Character.findByIdAndDelete(id);
    return character;
  }
}

export const CharacterServices = new characterService();