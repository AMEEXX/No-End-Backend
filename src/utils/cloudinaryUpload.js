import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const uploadFileCloudinary = async (localFilePath) => {
    try {
        const fileUpload = await cloudinary.uploader.upload
        (localFilePath,{
            resource_type :"auto"
        })
        console.log("The file has been uploaded to cloudinary on this url",fileUpload.url)
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("There was some error while uploading to cloudinary and the file has been removed from the server")
        return null
    }

}

export {uploadFileCloudinary}