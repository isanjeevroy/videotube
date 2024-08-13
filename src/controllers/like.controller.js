import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.models.js"
import { Tweet } from "../models/tweet.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video

    if (!videoId && videoId.length !== 24) {
        throw new ApiError(400, "Video id is valid!")
    }

    const liked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if (liked) {
        const video = await liked.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, video, "Video is unliked successfully!"))
    } else {
        const video = await Like.create({
            video: videoId,
            likedBy: req.user?._id
        })
        return res
            .status(200)
            .json(new ApiResponse(200, video, "Video is liked successfully!"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if (!commentId && commentId.length !== 24) {
        throw new ApiError(400, "Comment id is valid!")
    }
    const liked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if (liked) {
        const comment = await liked.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, comment, "Video is unliked successfully!"))
    } else {
        const comment = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
        return res
            .status(200)
            .json(new ApiResponse(200, comment, "Video is liked successfully!"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    if (!tweetId && tweetId.length !== 24) {
        throw new ApiError(400, "Tweet id is valid!")
    }
    const liked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (liked) {
        const tweet = await liked.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, tweet, "Video is unliked successfully!"))
    } else {
        const tweet = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
        return res
            .status(200)
            .json(new ApiResponse(200, tweet, "Video is liked successfully!"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    let likedVideos = await Like.find({
        $and: [
            { video: { $exists: true } },
            { likedBy: req.user?._id }
        ]
    }).populate('video');

    likedVideos = likedVideos.map(like => like.video);
    console.log(likedVideos)
    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "All liked video fetched successfully!"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}