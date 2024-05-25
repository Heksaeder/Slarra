import {Game, IGame} from './game.model';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export class gameService {
  async createGame(req: Request, res: Response) {
    try {
      const gameAttributes: IGame = req.body;
      const gameDB = await Game.findOne({title: gameAttributes.title});
      if(gameDB) {
        return res.status(400).send('Game already exists');
      }
      const game = await Game.create(gameAttributes);
      await game.save();
      return res.status(201).send(game);
    }
    catch (err) {
      console.error(err);
      return res.status(500);
    }
  }

  async getGames() {
    const games = await Game.find();
    return games;
  }

  async getGameById(id: string) {
    const game = await Game.findById(id);
    return game;
  }

  async updateGame(req: Request, res: Response) {
    try {
      const gameAttributes: IGame = req.body;
      const game = await Game.findByIdAndUpdate(req.params.id, gameAttributes, {new: true});
      return res.status(200).send(game);
    }
    catch (err) {
      console.error(err);
      return res.status(500);
    }
  }

  async deleteGame(id: string) {
    const game = await Game.findByIdAndDelete(id);
    return game;
  }
}

export const GameServices = new gameService();