import { NextFunction, Response } from "express";
import { ErrorMessages, SuccessMessages } from "../constants/Messages";
import { AuthRequest } from "../middlewares/authMiddleware";
import { authService } from "../services/AuthService";
import { STATUSCODE } from "../constants/StatusCodes";
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from "../dto/AuthDto";
import { CustomError } from "../middlewares/errorHandler";

export class AuthController {
  async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: RegisterUserDto = req.body;
      const { user } = await authService.register(userData);
      res.status(STATUSCODE.CREATED).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const loginData: LoginUserDto = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        loginData
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: 'none',

      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
        path: "/api/auth/refresh",
      });
      res.status(STATUSCODE.CREATED).json({
        success: true,
        accessToken,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.user) {
        req.user.refreshToken = null;
        await req.user.save();
      }
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      res.status(STATUSCODE.CREATED).json({
        success: true,
        message: "Successfully logged out",
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const passwordData: ChangePasswordDto = req.body;
      const { user } = await authService.changePassword(
        req.user._id,
        passwordData
      );
      res.status(STATUSCODE.CREATED).json({
        success: true,
        message: SuccessMessages.PASSWORD_CHANGED,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshTokenController(req: AuthRequest,res: Response,next: NextFunction): Promise<void> {
    try {
const refreshToken = req.cookies.refreshToken;
if(!refreshToken){
    throw new CustomError(ErrorMessages.UNAUTHORIZED_PLEASE_LOGIN, STATUSCODE.UNAUTHORIZED)
}

const tokens = await authService.refreshToken(refreshToken)
res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
    sameSite: 'none',
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    path: "/api/auth/refresh",
  });

  res.status(STATUSCODE.CREATED).json({
    success: true,
    accessToken : tokens.accessToken

  });

    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
