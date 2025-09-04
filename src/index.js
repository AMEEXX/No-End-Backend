
// require('dotenv').config({path : './env'})

import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
  path: './env'
})



connectDB().then(()=>{
  console.log("server running")
})

// const app = express();

// (async () => {
//   try {
//     await  mongoose.connect(`${process.env.MONGODB_URL}/ ${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("the app is not able to talk to the database", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log("The server is talking to the database");
//     });
//   } catch (error) {
//     console.log(
//       `there was some problem in connecting with database on port ${process.env.PORT}`
//     );
//     throw error;
//   }
// })();
// pwir
