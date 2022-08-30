import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { testToken } from './helpers';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

// middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  );
  next();
});

app.use(
  cors({
    origin: ['http://localhost:3002'],
  })
);

app.use(express.json()); // middleware to parse incoming json

interface UserLoginRequest {
  username: string;
  password: string;
}

app.post('/api/auth', (req: Request, res: Response) => {
  console.log('request:', req);

  const { body } = req;
  console.log('body:', body);
  const { username, password }: UserLoginRequest = body || {};

  if (username === 'test' && password === 'test123') {
    res.status(200).json({
      accessToken: testToken(10, true),
      refreshToken: 'refreshToken',
      roles: [2001, 5150],
    });
  } else {
    res.status(403).json({ msg: 'Login failed, please check credentials.' });
  }
});

// generate test refresh token that gives the correct testing accessToken
app.get('/api/refresh', (req: Request, res: Response) => {
  const { body } = req;
  const refreshToken = req.get('Authorization');
  console.log('current inc req:', req);
  console.log('current inc req authorization:', req.get('Authorization'));

  // check if fake refreshToken passes internal fake rule
  if (refreshToken === 'refreshToken') {
    // return new fake token
    return res.status(200).json({
      accessToken: Math.ceil(Math.random() * 10),
      refreshToken: 'refreshToken',
    });
  } else return res.status(403).json({ msg: 'Refresh token is invalid.' });
});

// get some fake users
app.get('/users', async (req: Request, res: Response) => {
  const token = req.get('Authorization');
  console.log('token:', token);

  const checkToken = testToken(10);
  const tokenResult =
    typeof checkToken === 'object' &&
    token &&
    checkToken.includes(parseInt(token));

  console.log(
    'checking token match:',
    tokenResult,
    '\ncheckToken:',
    checkToken,
    '\napi token:',
    token
  );
  if (tokenResult) {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );

    return res.json(data);
  }

  return res.status(403).json({
    msg: 'You do not have the correct permission to access this content.',
  });
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
