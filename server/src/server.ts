import mongoose from "mongoose";
import { config } from './config/basicConfig'
import app from './app'
import os from 'os'
import cluster from  'cluster'

const cpuNums = os.cpus().length


const startServer = async () : Promise<void> => {
    try{
await mongoose.connect(config.mongoUri)
console.log('Connected to mongodb')

const server  = app.listen(config.port, () => {
    console.log(`Worker with ${process.pid} : Server running on port ${config.port} in ${config.nodeEnv} mode`);
})
    }
    catch(err){
        console.error('failed to start server', err)
        process.exit(1)
    }

}
if(cluster.isPrimary){
    console.log(`Master process running with pid ${process.pid}`)

    for(let i=0;i<cpuNums;i++){
        cluster.fork()
    }

    cluster.on('exit' , (worker, code, signal) => {
console.log(`Worker with pid ${worker.process.pid} crashed, Spawning new process`)
cluster.fork()
    })
}else{
    startServer()
}



