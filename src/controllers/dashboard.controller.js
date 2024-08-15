import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
    // total views across all videos
    const videos = await Video.find({owner:req.user?._id})
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    
    // total subsribers
    const totalSubscribers = await Subscription.countDocuments({channel:req.user?._id})

    // total videos
    const totalVideos = await Video.countDocuments({owner:req.user?._id})
    
    // total likes across of videos
    const totalLikesOnVideos = await Like.countDocuments({
        video: { $in: await Video.find({ owner: req.user._id }).select('_id') }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { totalViews, totalSubscribers, totalVideos, totalLikesOnVideos }, "Data fetched successfully!"))

})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const videos = await Video.find({owner:req.user?._id})
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "All videos fetched successfully!" ))

})

export {
    getChannelStats, 
    getChannelVideos
    }