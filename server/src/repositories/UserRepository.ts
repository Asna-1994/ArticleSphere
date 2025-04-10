import { BaseRepository } from './BaseRepository';
import User, { IUser } from '../entities/User';

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByPhone(phone: string): Promise<IUser | null>;
  updatePreferences(userId: string, preferences: string[]): Promise<IUser | null>;
  findByIdWithPassword(id: string): Promise<IUser | null>; 
}

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password').exec();
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return User.findById(id).select('+password').exec(); 
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return User.findOne({ phone }).select('+password').exec();
  }

  async updatePreferences(userId: string, preferences: string[]): Promise<IUser | null> {
    console.log(preferences)
   const updatedUser =  await  User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true }
    ).exec();
    return updatedUser
  }
}

export const userRepository = new UserRepository();