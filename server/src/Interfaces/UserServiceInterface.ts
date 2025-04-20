
import { UpdateUserDto } from '../dto/UserDto';
import { ICategory } from '../entities/Categories';
import { IUser } from '../entities/User';


export interface IUserService {
getUserById(userId: string): Promise<IUser> 
 updateUser(userId: string, userData: UpdateUserDto): Promise<IUser> 
 updatePreferences(userId: string, preferencesData:string[]): Promise<IUser> 


}