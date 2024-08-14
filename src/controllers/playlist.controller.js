import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    //TODO: create playlist

    if (!name && !description) {
        throw new ApiError(400, "All fields are required!")
    }

    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: req.user?._id
        }
    );

    if (!playlist) {
        throw new ApiError(500, "Error occurred while creating playlist!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist created successfully!"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user's id!");
    }

    const playlists = await Playlist.find({ owner: userId })

    if (!playlists) {
        throw new ApiError(404, "Playlist not found!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "Playlists fetched successfully!"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist's id!");
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully!"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: add video to playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist's id!");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video's id!");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: videoId }
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Error occurred while adding video to playlist!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully!"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist's id!");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video's id!");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    );


    if (!updatedPlaylist) {
        throw new ApiError(500, "Error occurred while removing video from playlist!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully!"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist's id!");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist deleted successfully!"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist's id!");
    }

    if (!name && !description) {
        throw new ApiError(400, "All fields are required!")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Error occurred while updating playlist!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist is updated successfully!"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}