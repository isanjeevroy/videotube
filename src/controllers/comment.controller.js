import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video

    //get data
    const {videoId} = req.params
    const {page = 1, limit = 2} = req.query

    let skip = ( page - 1 ) * limit

    const comments= await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            },
        },
        {
            $project:{
                content:1,
                owner:1
            }
        }
       
    ]).skip(skip).limit(limit)

    if(!comments){
        throw new ApiError(400,"Not comment found for this video")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "All comment fetched successfully!"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if(!content){
        throw new ApiError(400,"Field is required!")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if(!comment){
        throw new ApiError(500,"Comment doesn't created, because of server problem!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment is created successfully!"))
        
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params

    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Filed is requried!")
    }

    const comment = await Comment.findByIdAndUpdate(commentId,{
        content
    },{new: true})

    if(!comment){
        throw new ApiError(500, "Something went wrong while updating!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully!"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new ApiError(500, "Something went wrong while updating!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment deleted successfully!"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }