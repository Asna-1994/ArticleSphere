import { config } from "../config/basicConfig";
import { IUser } from "../entities/User";
import  jwt   from "jsonwebtoken";

  export const generateToken = (user: IUser):{ accessToken : string, refreshToken  :string }=> {
    const accessToken : string =  jwt.sign({ id: user._id }, config.jwtSecret , {
      expiresIn: '15m'
    });


    const refreshToken : string = jwt.sign({id : user._id}, config.refresh_token_secret ,{
      expiresIn : '7d'
    })

    return { accessToken, refreshToken}
  }