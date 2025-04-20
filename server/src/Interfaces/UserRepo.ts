import { IUser } from "../entities/User";
import { BaseRepository } from "../repositories/BaseRepoImpl";




export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByPhone(phone: string): Promise<IUser | null>;
  updatePreferences(userId: string, preferences: string[]): Promise<IUser | null>;
  findByIdWithPassword(id: string): Promise<IUser | null>; 

}