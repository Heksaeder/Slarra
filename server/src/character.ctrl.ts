import {CharacterServices} from './character.srv';
import {Request, Response} from 'express';
import {characterValidate} from './character.model';

class characterController {
  createCharacter = async (req: Request, res: Response) => {
    try {
      const { error } = characterValidate.validate({
        ...req.body,
        userId: req.userId,
        gameId: req.body.gameId,
      });
      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      const userId = req.userId;

      const characterAttributes = {
        ...req.body,
        userId,
      };

      const character = await CharacterServices.createCharacter(characterAttributes);
      return res.status(201).send(character);
    } catch (error) {
      res.status(500);
    }
  }

  getCharacters = async (req: Request, res: Response) => {
    try {
      const characters = await CharacterServices.getCharacters();
      res.status(200).json(characters);
    } catch (error) {
      res.status(500);
    }
  }

  getCharacterById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const character = await CharacterServices.getCharacterById(id as string);
      res.status(200).json(character);
    } catch (error) {
      res.status(500);
    }
  }
  
  // Get all characters for a specific game created by the logged-in user
  getCharactersByGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const userId = req.userId; // Assuming userId is added by authMiddleware
      const characters = await CharacterServices.getCharactersByGame(gameId as string, userId as string);
      res.status(200).json(characters);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }

  updateCharacter = async (req: Request, res: Response) => {
    const data = {
      name: req.body.name,
      gameId: req.body.gameId,
      userId: req.body.userId
    };
    
    const { error, value } = characterValidate.validate(data);

    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
       try {
      const character = await CharacterServices.updateCharacter(req, res);
      res.status(200).json(character);
       } catch (err) {
      res.status(500);
    }
  }
}
   deleteCharacter = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const character = await CharacterServices.deleteCharacter(id as string);
      res.status(200).json(character);
    } catch (error) {
      res.status(500);
    }
  }
}

export const CharacterController = new characterController();