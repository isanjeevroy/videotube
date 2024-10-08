import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id!")
    }

    const subscribedChannel = await Subscription.findOne(
        {
            subscriber: req.user?._id,
            channel: channelId
        }
    );

    if (subscribedChannel) {
        await subscribedChannel.deleteOne()
        return res
            .status(200)
            .json(new ApiResponse(200, subscribedChannel, "Channel is unsubscribed successfully!"))
    } else {
        const subscribed = await Subscription.create(
            {
                subscriber: req.user?._id,
                channel: channelId
            }
        )
        return res
            .status(200)
            .json(new ApiResponse(200, subscribed, "Channel is subscribed successfully!"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id!")
    }
    const subscribers = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(channelId) // Matching channel ID with User ID
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "subscriber",
                            foreignField: "_id",
                            as: "subscriberDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            subscriberDetails: { $arrayElemAt: ["$subscriberDetails", 0] }
                        }
                    },
                    {
                        $project:{
                            subscriberDetails:1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                subscribers:1
            }
        }
    ]);

    if(subscribers.length===0){
        throw new ApiError(400,"No one has subscribed your channel!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers[0], "Subscribers fetched successfully!"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid subscriber id!")
    }

    const subscribedChannels = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(subscriberId) // Matching subscriber ID with User ID
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriptions",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "channel",
                            foreignField: "_id",
                            as: "channelDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            channel: {
                                $first: "$channelDetails"
                            }
                        }
                    },
                    {
                        $project: {
                            channel: 1
                        }
                    }
                ]
            }
        },
        {
            $project:{
                subscriptions: 1
            }
        }
    ]);

    if(subscribedChannels.length === 0){
        throw new ApiError(400,"You haven't subscribed any channel!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannels, "Subsribered channel fetched successfully!"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}