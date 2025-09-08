import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: "./env",
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`The server is running on the port ${process.env.PORT}`)
        })
        app.on("error", (err) => {
            console.log(
                "There waas an error while connection to the server",err
            )
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection failed !!!!", error)
    })
