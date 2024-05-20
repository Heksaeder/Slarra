import { GameServices } from "./game.srv";
import { Request, Response } from "express";
import { gameValidate } from "./game.model";

class gameController {
  createGame = async (req: Request, res: Response) => {
    const data = {
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
    };
    
    const { error, value } = gameValidate.validate(data);

    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      try {
        const game = await GameServices.createGame(req, res);
        return res.status(201).send(game);
      } catch (err) {
        return res.status(500);
      }
    }
  }

  getGames = async (req: Request, res: Response) => {
    const games = await GameServices.getGames();
    return res.status(200).send(games);
  }

  getGameById = async (req: Request, res: Response) => {
    const game = await GameServices.getGameById(req.params.id);
    return res.status(200).send(game);
  }

  updateGame = async (req: Request, res: Response) => {
    const data = {
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
    };
    
    const { error, value } = gameValidate.validate(data);

    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      try {
        const game = await GameServices.updateGame(req, res);
        return res.status(200).send(game);
      } catch (err) {
        return res.status(500);
      }
    }
  }

  deleteGame = async (req: Request, res: Response) => {
    const game = await GameServices.deleteGame(req.params.id);
    return res.status(200).send(game);
  }
}

export const GameController = new gameController();