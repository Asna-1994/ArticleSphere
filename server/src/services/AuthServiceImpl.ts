import jwt from 'jsonwebtoken';
import { IAuthService } from '../Interfaces/AuthServiceInterface';
import { ChangePasswordDto, LoginUserDto, RegisterUserDto } from '../dto/AuthDto';
import { IUser } from '../entities/User';
import { ErrorMessages } from '../constants/Messages';
import { STATUSCODE } from '../constants/StatusCodes';
import { CustomError } from '../middlewares/errorHandler';
import { generateToken } from '../utils/tokenUtils';
import { config } from '../config/basicConfig';
import { IUserRepository } from '../Interfaces/UserRepo';


export interface JwtPayload {
  id: string;
}

export class AuthServiceImpl implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(userData: RegisterUserDto): Promise<{ user: IUser }> {
    const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new CustomError(ErrorMessages.USER_ALREADY_EXISTS, STATUSCODE.BAD_REQUEST);
    }

    const existingUserByPhone = await this.userRepository.findByPhone(userData.phone);
    if (existingUserByPhone) {
      throw new CustomError(ErrorMessages.USER_WITH_PHONE_EXISTS, STATUSCODE.BAD_REQUEST);
    }

    const user = await this.userRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dob: new Date(userData.dob),
      password: userData.password,
      preferences: userData.preferences
    });

    return { user };
  }

  async login(loginData: LoginUserDto): Promise<{ 
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = 
      await this.userRepository.findByEmail(loginData.identifier) ||
      await this.userRepository.findByPhone(loginData.identifier);
    
    if (!user) {
      throw new CustomError(ErrorMessages.INVALID_CREDENTIAL, STATUSCODE.UNAUTHORIZED);
    }

    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new CustomError(ErrorMessages.INVALID_CREDENTIAL, STATUSCODE.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = generateToken(user);
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { user, accessToken, refreshToken };
  }

  async changePassword(userId: string, passwordData: ChangePasswordDto): Promise<{ user: IUser }> {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new CustomError(ErrorMessages.USER_NOT_FOUND, STATUSCODE.NOT_FOUND);
    }
    
    const isPasswordValid = await user.comparePassword(passwordData.currentPassword);
    if (!isPasswordValid) {
      throw new CustomError('Entered password is incorrect', STATUSCODE.UNAUTHORIZED);
    }

    user.password = passwordData.newPassword;
    await this.userRepository.save(user);
    
    return { user };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const decoded = jwt.verify(refreshToken, config.refresh_token_secret) as JwtPayload;
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new CustomError(ErrorMessages.INVALID_TOKEN, STATUSCODE.UNAUTHORIZED);
      }

      const tokens = generateToken(user);
      user.refreshToken = tokens.refreshToken;
      await this.userRepository.save(user);
      
      return tokens;
    } catch (err) {
      throw new CustomError(ErrorMessages.INVALID_TOKEN, STATUSCODE.UNAUTHORIZED);
    }
  }
}