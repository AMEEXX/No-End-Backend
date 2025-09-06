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