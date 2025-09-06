// const asyncHandler = (fn) => async ()=> {
//     try {
//         await fn(res,res,next)
//     } catch (error) {
//         res.status(error.code).json({
//             succes : false,
//             message : error.message
//         })
        
//     }

// }

const asyncHandler = (requestHandler) => (req,res,next) =>{
    Promise.resolve(requestHandler(req,res,next)).catch(error =>{
        console.log("There was an error while the fectching or do something",error)
    })
}

export {asyncHandler};
