import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './config/db.config';
import userRouter from './src/user.route';
import gameRouter from './src/game.route';
import charRouter from './src/character.route';

const app = express();

const PORT: number = parseInt(process.env.PORT || '8001', 10);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/games', gameRouter);
app.use('/characters', charRouter);

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error(err);
});