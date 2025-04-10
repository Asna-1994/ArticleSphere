import { userRepository } from '../repositories/UserRepository';
import { UpdateUserDto  } from '../dto/UserDto';
import { IUser } from '../entities/User';
import { CustomError } from '../middlewares/errorHandler';
import { STATUSCODE } from '../constants/StatusCodes';
import { ErrorMessages } from '../constants/Messages';

export class UserService {
  async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new CustomError(ErrorMessages.USER_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }
    return user;
  }

  async updateUser(userId: string, userData: UpdateUserDto): Promise<IUser> {
    const updatedUser = await userRepository.update(userId, {
      ...(userData.firstName && { firstName: userData.firstName }),
      ...(userData.lastName && { lastName: userData.lastName }),
      ...(userData.phone && { phone: userData.phone }),
      ...(userData.dob && { dob: new Date(userData.dob) })
    });

    if (!updatedUser) {
      throw new CustomError(ErrorMessages.USER_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }

    return updatedUser;
  }

  async updatePreferences(userId: string, preferencesData:string[]): Promise<IUser> {
    console.log(preferencesData)
    const updatedUser = await userRepository.updatePreferences(userId, preferencesData);
    
    if (!updatedUser) {
      throw new CustomError(ErrorMessages.USER_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }

    return updatedUser;
  }
}

export const userService = new UserService();