import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/basicConfig'
import User from '../entities/User';
import { ErrorMessages } from '../constants/Messages';
import { CustomError } from './errorHandler';
import { STATUSCODE } from '../constants/StatusCodes';
import { jwtPayload } from '../services/AuthService';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.accessToken;


    if (!token) {
      throw new CustomError(ErrorMessages.UNAUTHORIZED_PLEASE_LOGIN,STATUSCODE.UNAUTHORIZED );
    }

 
    const decoded: jwtPayload = jwt.verify(token, config.jwtSecret) as jwtPayload


    const user = await User.findById(decoded.id);
    if (!user) {
      throw new CustomError('The user belonging to this token no longer exists.', STATUSCODE.UNAUTHORIZED);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(new CustomError(ErrorMessages.INVALID_TOKEN, STATUSCODE.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};