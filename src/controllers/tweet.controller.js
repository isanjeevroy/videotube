import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    // get data
    const {content} = req.body 

    // validate data
    if(!content){
        throw new ApiError(400,"Field is required!")
    }

    // create in database
    const tweet = await Tweet.create({
        owner: req.user?._id,
        content
    })

    // res send
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet is created successfully!")
    )
   
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    //validate user id
    if(!userId?.trim()){
        throw new ApiError(400,"User id is missing!")
    }

    // search in database
    const tweets = await Tweet.find({owner: userId}).select("-owner")
  
    if(!tweets?.length){
        throw new ApiError(400,"No tweets exists for this user!")
    }

    // res send
    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully!"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    // get data
    const {tweetId} = req.params
    const {content} = req.body
    
    // validate data
    if(!tweetId?.trim()){
        throw new ApiError(400,"Tweet id is missing!")
    }

    if(!content){
        throw new ApiError(400,"Field is required!")
    }

    // update in database
    const tweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set:{
                content
            }
        },
        {new: true}
    )

    // return res
    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet has updated successfully!"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if(!tweetId?.trim()){
        throw new ApiError(400,"Tweet id is missing!")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new ApiError(400,"Tweet' id is invalid")
    }

    // res send
    return res
    .status(400)
    .json(new ApiResponse(200,tweet,"Tweet is deleted successfully!"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}