import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import { app } from './app.js'

dotenv.config({
  path : './env'
})


connectDB()
.then(()=>{
  app.listen(process.env.PORT, ()=>{
   console.log(`The server is running on the port ${process.env.PORT}`)
  })
  app.on(err, ()=>{
    console.log("There waas an eerror whilte connection to the server". err
    )
  })
})
.catch((err)=>{
  console.log("MongoDB Connection failed !!!!", err
  
  );

})