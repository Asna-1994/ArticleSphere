import { Request, Response, NextFunction } from 'express';
import { STATUSCODE } from '../constants/StatusCodes';
import { ErrorMessages } from '../constants/Messages';

export class CustomError extends Error {
  statusCode: STATUSCODE

  constructor( message: string,statusCode: STATUSCODE) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const errorHandler = ( 
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => { 
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  return res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ErrorMessages.INTERNAL_SERVER_ERROR,
    statusCode: STATUSCODE.INTERNAL_SERVER_ERROR,
  });

};