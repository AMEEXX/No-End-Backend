# 📘 ORMs, ODMs & Backend Setup Notes

## 🔹 ORM vs ODM

- **ORM:** SQL databases (MySQL, PostgreSQL) - no raw SQL needed
- **ODM:** NoSQL databases (MongoDB) - same concept, different data structure

✅ Both = bridge between code objects and database storage

---

## 🔹 Quick Examples

**Full-Featured:** Hibernate, SQLAlchemy, Entity Framework
**Lightweight:** Dapper, Sequel

**Framework Built-in:** Django ORM, ActiveRecord, Eloquent

**Node.js Options:**

- **Mongoose** → MongoDB
- **Prisma** → SQL + MongoDB
- **Sequelize** → SQL only

---

# 🚀 Node.js & Backend Flow

## What is Node.js?

- A **JavaScript runtime environment** that lets you **run JS outside the browser**.
- Used to build **servers, APIs, CLIs, and backend systems**.

---

## 🏗 Backend Setup Flow

1. **Initialize Project**
    - Create an empty `npm` project
    - Set up folder structure
    - Install & import **Express**
    - Make basic routes and start server with `app.listen()`
2. **Environment Setup**
    - Install `dotenv` → Manage secrets (`PORT`, `DB_URL`)
    - `.env` file stores sensitive data like database credentials
3. **CORS Setup**
    - Install `cors` package
    - Whitelist frontend URLs (e.g., [`http://localhost:5173`](http://localhost:5173/))
    - Standardize API endpoints → e.g., `/api/jokes`
4. **Frontend Proxying**
    - Instead of writing full URLs ([`http://localhost:3000`](http://localhost:3000/)) in frontend,
        
        configure proxy in `vite.config.js`.
        

---

# 🗄 Database Layer

## 1. Designing the Database

- Decide **where** and **how** data will be stored
- Example: Registration/Login → Users collection

## 2. Mongoose Modeling

```jsx
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"  // Reference another schema
  }
}, { timestamps: true });

```

👉 **Notes:**

- Collection name auto-pluralizes → `User` → `Users`
- Constraints: `unique`, `required`
- Timestamps: `{ timestamps: true }` auto adds `createdAt` & `updatedAt`

---

# ⚙️ Dev Setup

1. **Install Nodemon** (dev dependency)
    
    ```bash
    npm i -D nodemon
    
    ```
    
    Runs server automatically on file changes.
    
2. **MongoDB Cluster Setup**
    - Create cluster in MongoDB Atlas
    - Get **connection string & password**
    - Add to `.env` file
    - ⚠️ Remove trailing slash at the end of URL
3. **Database Connection**

```jsx
// src/db/index.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("✅ Database Connected");
  } catch (err) {
    console.error("❌ Database Connection Failed", err);
    process.exit(1); // Exit if DB not connected
  }
};

export default connectDB;

```

```jsx
// require('dotenv').config({path : './env'})

import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import { app } from './app.js'

dotenv.config({
  path: './env'
})

connectDB()
.then(() => {
  app.listen(process.env.PORT, () => {
   console.log(`The server is running on port ${process.env.PORT}`)
  })
  app.on("error", (err) => {
    console.log("There was an error while connecting to the server", err)
  })
})
.catch((err) => {
  console.log("MongoDB Connection failed !!!!", err);
})

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
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

```

## **DATABASE CONNECTION TIPS**

While connecting the database, remember to add this line:

```
${process.env.MONGODB_URL}/${DB_NAME}?retryWrites=true&w=majority

```

What this does is retry connecting to the DB if it fails, and the majority part saves the DB data before actually using or doing anything. These are production-level practices.

Now once the database is connected, we can do the error logging inside the `connectDB` function itself and not do anything in the main `app.js`.

Then in the `app.js` file, we'll be exporting the express app like this:

```jsx
const app = express()

```

Later export it and use it in the `index.js` file to resolve the promises from the `connectDB`.

---

# **COOKIE PARSER & MIDDLEWARES**

Then you configure the incoming requests in the `app.js` like this:

```jsx
app.use(express.json({limit: "16kb"})) // to parse and interpret incoming objects as JSON
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

```

---

# **UTILS**

## Make a utility for async handler

### Using the **try-catch method:**

```jsx
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code).json({
            success: false,
            message: error.message
        })
    }
}
export { asyncHandler }

```

## **HOW PROMISES ARE USED**

Promises are used to resolve something asynchronously... then the promises will return a promise just like a function.

*Then we can use async/await and try-catch while resolving a promise:*

```jsx
async function getData() {
    try {
        const res = await fetch('...')
        // ...
    } catch (error) {
        console.log(error)
    }
}

```

This will be the format for our utils function with the promises:

```jsx
const asyncHandler = (requestHandler) => (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(error => {
        console.log("There was an error while fetching or doing something", error)
    })
}

```

---

# **ERROR STANDARDIZATION**

In JavaScript, while making a class you directly make a constructor, and inside the constructor only the initialization of the data points happens. Custom errors are written like this:

```jsx
class CustomApiErrors extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        stack = "",
        errors = []
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

```

Similarly, you'll have to make a class for responses, and this is how it'll be done:

```jsx
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400 // should be less than 400 because anything above it will send through the error response
    }
}

```

---

# **DATA MODELS**

The ID of users are usually stored in **BSON** data, not JSON data. BSON is binary encoded data that computers understand bit faster and is secretly kept - cannot be read by humans.

```jsx
import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Video = mongoose.model("Video", videoSchema)

```

Now we'll install **mongoose aggregate paginate**... Understand it like this: It's like using MySQL - how we used to write queries to fetch some exact data like `SELECT * FROM WHERE =` - similarly the aggregate pipeline does this.

## **BCRYPT**

Used for password encrypting.

Now we'll be using a **pre hook** to actually bcrypt our password just before saving it like this:

```jsx
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

```

---

# **JWT**

It is a **bearer token**. "Jiske paas hai wo uska malik hai" - JWT are really interesting. They're like "whoever has them is their owner" and are highly safe to use as well.

This has two things: **REFRESH TOKEN and ACCESS TOKENS.**

The expiry of refresh token is usually slightly higher than the access tokens.

These tokens can be made automated to generate, and this is how they'll be done inside each user schema or model:

```jsx
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

```

---

# **FILE UPLOADING**

**Flow:** User → Multer (stores in temp file in the computer) → Cloudinary is used and multer uploads to the database.

This is how the file upload on Cloudinary will be done:

```jsx
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("The file has been uploaded on the URL:", response.url)
        fs.unlinkSync(localFilePath) // remove temp file after successful upload
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        // remove the locally saved temp file as the upload failed
        return null
    }
}

```

---

## **MULTER DEEP DIVE**

### **1. What Multer Does**

- **Multer is an Express middleware** that processes `multipart/form-data`, the format used for file uploads.
- It handles the parsing of incoming files, making them accessible to your Node.js application.

### **2. Where Files are Saved**

- **Local Disk (DiskStorage):** Files are saved to a folder on your computer's hard drive. This is common for **local development** but not suitable for most production environments.
- **Memory (MemoryStorage):** Files are held as a `Buffer` (a temporary block of memory) in the server's RAM. This is the **best practice for production**, especially when uploading to a cloud service.
- **Cloud Storage:** Files are uploaded to a dedicated service like **Cloudinary, Amazon S3, or Google Cloud Storage**. This is where files are **permanently saved** in a production environment.

### **3. Development vs. Production**

- **Development:** You can use `diskStorage` because your laptop acts as the server, and its disk is persistent.
- **Production:** You **should not** use `diskStorage` on platforms like Render or Heroku because their file systems are **ephemeral** (temporary and get wiped clean). Saving files there will cause them to be lost.

### **4. Recommended Production Workflow**

1. **Use Multer with `memoryStorage`** to get the file as a `Buffer`.
2. **Upload the `Buffer` directly to Cloudinary** using a library like `multer-storage-cloudinary` or Cloudinary's native upload stream functionality.
3. **Store the permanent Cloudinary URL** in your MongoDB database.
4. This keeps your server **stateless** and ensures files are always available and never lost.
5. 

### Node.js Path Basics

- **`./` in a string path**
    
    Means **relative to the current working directory (`process.cwd()`)**, i.e., where you start your Node.js process.
    
    Example:
    
    ```jsx
    './public/temp' // points to <project-root>/public/temp if you run node from project root
    ```
    
- **`__dirname`**
    
    The absolute path of the **folder where the current file lives**.
    
    Example:
    
    ```jsx
    // Inside src/middleware/multer.js
    console.log(__dirname) // '/.../project-root/src/middleware'
    ```
    
- **Reliable path building with `path.join()` and `__dirname`**
    
    Use this to make paths stable regardless of where you run Node from:
    
    ```jsx
    const path = require('path');
    const uploadPath = path.join(__dirname, '../../public/temp');
    ```
    

Multer usage 

```jsx
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp ')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
```

Minor tweaks can be made on this please check.

________________________________________CONFIGURATION —ENDS___________________________________

HTTPS NOtes

Https is only a another layer of encryption added for security.

HTTP NOTES IMAGE has been inserted 

![image.png](attachment:6d7bb195-1590-438a-ad7a-60bc71594dde:image.png)

![image.png](attachment:3a89e761-df58-4d43-a54d-d9ccdb9a9100:image.png)