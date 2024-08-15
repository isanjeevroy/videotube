import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {

      //TODO: get all videos based on query, sort, pagination

    const { page = 1, limit = 2, query, sortBy, sortType, userId } = req.query

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id!")
    }

    const totalVideos = await Video.countDocuments({owner:userId})

    if(!totalVideos){
        throw new ApiError(400, "Video not found!")
    }

    const totalPage = Math.ceil( totalVideos / limit )

    let skip = ( page - 1 ) * limit

    const sortOptions = {
        [sortBy]: sortType === 'desc' ? -1 : 1
    };

    const videos = await Video.find({owner:userId})
                                .sort(sortOptions)
                                .skip(skip).limit(limit)

    return res
        .status(200)
        .json(new ApiResponse(200, { videos, totalPage }, "All videos fetched successfully!" ))

})

const publishAVideo = asyncHandler(async (req, res) => {

    //get data
    const { title, description } = req.body

    //validate data
    if (!title && !description) {
        throw new ApiError(400, "All fields are required!")
    }

    //get files from multer
    const localFileVideo = req.files?.videoFile[0]?.path;
    const localFileThumbnail = req.files?.thumbnail[0]?.path;

    //validate files
    if (!localFileVideo && !localFileThumbnail) {
        throw new ApiError(400, "All fields are required")
    }

    // uploaded to cloudinary
    const videoFile = await uploadOnCloudinary(localFileVideo)
    const thumbnail = await uploadOnCloudinary(localFileThumbnail)

    // validate uploaded files
    if (!videoFile && !thumbnail) {
        throw new ApiError(400, "All fields are required")
    }

    // duration of video from cloudinary
    const duration = parseFloat(videoFile.duration.toFixed(2))

    // create in database
    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration,
        owner: req.user?._id
    })

    //send response
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video has uploaded successfully!"))

})

const getVideoById = asyncHandler(async (req, res) => {

    //get videoId
    const { videoId } = req.params

    //validate videoId
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id!")
    }

    //find video by id
    const video = await Video.findById(videoId)

    //validate video
    if (!video) {
        throw new ApiError(400, "Does not exist video for this id!")
    }

    //return response
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully!"))

})

const updateVideo = asyncHandler(async (req, res) => {

    //get video id
    const { videoId } = req.params

    const { title, description } = req.body

    //validate data
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id!")
    }

    if (!title && !description) {
        throw new ApiError(400, "All field are required!")
    }

    // find path
    const localFileThumbnail = req.file?.path

    // validate thumbnail
    if (!localFileThumbnail) {
        throw new ApiError(400, "Thumbanil is missing!")
    }

    // upload to cloudinary
    const thumbnail = await uploadOnCloudinary(localFileThumbnail)

    // validate thumbnail
    if (!thumbnail) {
        throw new ApiError(500, "Error occures while uploading the video!")
    }

    //update in database
    const video = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            thumbnail: thumbnail.url
        }
    },
        { new: true }
    )

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video has updated successfully!"))

})

const deleteVideo = asyncHandler(async (req, res) => {

    //get video id
    const { videoId } = req.params

    // validate id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id!")
    }

    //find the video exist or not
    const video = await Video.findByIdAndDelete(videoId)

    // validate video
    if (!video) {
        throw new ApiError(400, "Doesn't exist video!")
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video deleted successfully!"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {

    //get video id
    const { videoId } = req.params

    //validate video id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id!")
    }
    
    //find video
    const video = await Video.findById(videoId)

     // validate video
     if (!video) {
        throw new ApiError(400, "Video not found!")
    }

    //update video
    const updateVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished: !video.isPublished 
            }
        },
        { new: true }
    )

    //return response
    return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video is updated successfully!"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}