import { ChangePasswordDto, LoginUserDto, RegisterUserDto } from '../dto/AuthDto';
import { IUser } from '../entities/User';


export interface IAuthService {
register(userData: RegisterUserDto): Promise<{ user: IUser }> 
login(loginData: LoginUserDto): Promise<{ user: IUser;accessToken: string, refreshToken : string }>
changePassword(userId: string, passwordData: ChangePasswordDto): Promise<{ user: IUser }> 
refreshToken(refreshToken: string): Promise<{accessToken   : string, refreshToken  :string}>

}
