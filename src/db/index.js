import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () =>{
    try {
        const connectionDb = await mongoose.connect(`${process.env.MONGODB_URL}/ ${DB_NAME}`)
        console.log(`The connection is succesfull !!!!! and the DB HOST : ${connectionDb.connetion.host}`)
        
        
    } catch (error) {
        console.log("MongoDb didnt connect", error)
        process.exit(1);
        
    }
}
export default connectDB
