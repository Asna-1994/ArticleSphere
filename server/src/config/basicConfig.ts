import dotenv from 'dotenv';


dotenv.config();

interface IConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  refresh_token_secret:string;
}

export const config: IConfig = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://asnavt:MK@pvNFxm96Ai2M@cluster0.nmtmuc0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  refresh_token_secret : process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret',
};


if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set in environment variables.');
}

if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI not set in environment variables.');
}