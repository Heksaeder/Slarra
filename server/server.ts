import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './config/db.config';
import userRouter from './src/users/user.route';
import gameRouter from './src/games/game.route';
import charRouter from './src/characters/character.route';
import topicRouter from './src/topics/topic.route';
import messageRouter from './src/messages/message.route';

const app = express();

const PORT: number = parseInt(process.env.PORT || '443', 10);

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/games', gameRouter);
app.use('/characters', charRouter);
app.use('/topics', topicRouter);
app.use('/posts', messageRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
}).catch((err) => {
  console.error(err);
});