import mongoose from "mongoose";
import { config } from './config/basicConfig'
import app from './app'

const startServer = async () : Promise<void> => {
    try{
await mongoose.connect(config.mongoUri)
console.log('Connected to mongodb')

const server  = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
})
    }
    catch(err){
        console.error('failed to start server', err)
        process.exit(1)
    }

}

startServer()