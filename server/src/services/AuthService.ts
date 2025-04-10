import  jwt  from 'jsonwebtoken';
import { generateToken } from './../utils/tokenUtils';
import { CustomError } from './../middlewares/errorHandler';
import { userRepository } from '../repositories/UserRepository';
import { IUser } from '../entities/User';
import { STATUSCODE  } from '../constants/StatusCodes';
import { ErrorMessages } from '../constants/Messages';
import { ChangePasswordDto, LoginUserDto, RegisterUserDto } from '../dto/AuthDto';
import { config } from '../config/basicConfig'


export interface jwtPayload {
  id : string
}


export class AuthService {


  async register(userData: RegisterUserDto): Promise<{ user: IUser }> {


    const existingUserByEmail = await userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new CustomError(ErrorMessages.USER_ALREADY_EXISTS, STATUSCODE.BAD_REQUEST);
    }


    const existingUserByPhone = await userRepository.findByPhone(userData.phone);
    if (existingUserByPhone) {
      throw new CustomError(ErrorMessages.USER_WITH_PHONE_EXISTS, STATUSCODE.BAD_REQUEST);
    }


    const user = await userRepository.create({
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

  async login(loginData: LoginUserDto): Promise<{ user: IUser;accessToken: string, refreshToken : string }> {

    const user = 
      await userRepository.findByEmail(loginData.identifier) || 
      await userRepository.findByPhone(loginData.identifier);

    if (!user) {
      throw new CustomError(ErrorMessages.INVALID_CREDENTIAL, STATUSCODE.UNAUTHORIZED);
    }


    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new CustomError(ErrorMessages.INVALID_CREDENTIAL, STATUSCODE.UNAUTHORIZED);
    }

   
    const {accessToken, refreshToken} = generateToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async changePassword(userId: string, passwordData: ChangePasswordDto): Promise<{ user: IUser }> {
  console.log(userId)
    const user = await userRepository.findByIdWithPassword(userId)
    if (!user) {
      throw new CustomError(ErrorMessages.USER_NOT_FOUND,STATUSCODE.NOT_FOUND);
    }
    const isPasswordValid = await user.comparePassword(passwordData.currentPassword);
    if (!isPasswordValid) {
      throw new CustomError('Entered password is incorrect', STATUSCODE.UNAUTHORIZED);
    }

    user.password = passwordData.newPassword;
    await user.save();
    return { user };
  }



  async refreshToken(refreshToken: string): Promise<{accessToken   : string, refreshToken  :string}>{
    try{
      const decoded : jwtPayload = jwt.verify(refreshToken ,  config.refresh_token_secret) as jwtPayload
      const user = await userRepository.findById(decoded.id)
      if (!user || user.refreshToken !== refreshToken) {
        throw new CustomError(ErrorMessages.INVALID_TOKEN, STATUSCODE.UNAUTHORIZED);
      }
      
      const tokens  : {accessToken : string, refreshToken  :string}= generateToken(user)
      user.refreshToken = tokens.refreshToken
      await user.save()
      return tokens
    }
    catch(err : any){
     throw new CustomError(ErrorMessages.INVALID_TOKEN,STATUSCODE.UNAUTHORIZED)
    }

  }
}

export const authService = new AuthService();