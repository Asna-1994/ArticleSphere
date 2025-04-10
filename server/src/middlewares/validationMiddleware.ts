import { NextFunction , Response ,Request} from "express";
import { STATUSCODE } from "../constants/StatusCodes";
import { validationResult } from "express-validator";
import { AuthRequest } from "./authMiddleware";

export const validateRequest = (
    req: Request<any> | AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
  
      res.status(STATUSCODE.BAD_REQUEST).json({
        success: false,
        message: firstError.msg,
      });
      return;
    }
    next();
  };