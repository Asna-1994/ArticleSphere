
import { NextFunction,  Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { STATUSCODE } from "../constants/StatusCodes";
import { UpdateUserDto } from "../dto/UserDto";
import { userService } from "../services/UserService";
import { SuccessMessages } from "../constants/Messages";

export class UserController {
  async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await userService.getUserById(req.user._id);
      res.status(STATUSCODE.OK).json({
        success: true,
        message: SuccessMessages.FETCHED_USER,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updateData: UpdateUserDto = req.body;
      const updatedUser = await userService.updateUser(
        req.user._id,
        updateData
      );
      res.status(STATUSCODE.OK).json({
        success: true,
        message: SuccessMessages.UPDATED_USER,
        user : updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePreferences(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatePreferenceData = req.body;
      console.log(updatePreferenceData)

      const updatedUser = await userService.updatePreferences(
        req.user._id,
        updatePreferenceData
      );
      res.status(STATUSCODE.OK).json({
        success: true,
        message: SuccessMessages.UPDATED_USER_PREFERENCES,
        updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
}


export const userController  = new UserController()