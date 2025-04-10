import express ,{Application, Request, Response, NextFunction} from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from "helmet";
import morgan from 'morgan'
import {config} from './config/basicConfig'
import { errorHandler } from "./middlewares/errorHandler";
import { STATUSCODE } from "./constants/StatusCodes";
import { ErrorMessages } from "./constants/Messages";
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import articlesRoutes from './routes/articleRoutes'
import categoryRoutes from './routes/categoryRoutes'


const app :Application = express()


app.use(helmet());
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/articles', articlesRoutes)


app.use((req:Request, res : Response) => {
    res.status(STATUSCODE.NOT_FOUND).json({
        success : false,
        message   : ErrorMessages.NOT_FOUND
    })
})
app.use(
    errorHandler as (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  );
export default app