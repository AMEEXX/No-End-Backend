import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose, { Schema } from "mongoose";


const videoSchema = new Schema ({
    videoFile : {
        type : String,
        required : true,

    },
    thumbnail : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    decription : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    views : {
        type : number ,
        default : 0,
        required : true
    },
    isPublished : {
        types : bool ,
        default : false  
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }

}, {timestamps : true
})

export const Video = mongoose.model("video", videoSchema) 
userSchmea.methods.isPasswordCorrect = async function (password){
    await  bcrypt.compare(password, this.password)
}
userSchmea.methods.generateAccessTokens = fucntion() {
    
}
userSchmea.methods.generateRefreshTokens = fucntion() {
     
}

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: Strin,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model("user", UserSchema)
