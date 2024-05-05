import * as c from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { ObjectId } from "mongodb";

// getting the data for how the posts are viewed (social feed)
export const getFeed = async (userID) => {
  // get the playlists that are posted
  const playlistsCollection = await c.playlists();
  if (!playlistsCollection) throw `Database not found`;
  let sharedPlaylists = await playlistsCollection
    .find({ posted: true })
    .toArray();
  if (!sharedPlaylists) throw `Could not retrieve playlists`;
  // I'll get the first 5 tracks in each playlist later, probably in the routes before rendering a handlebar
  let ret = [];
  for(const playlist of sharedPlaylists){
    if(playlist.userID != userID){
      ret.push(playlist);
    }
  }
  return ret;
};

// adding one comment (str: comment, str: playlistId)
export const addComment = async (comment, userId, playlistId) => {
  // comment validation
  comment = helper.checkComment(comment, "Comment");
  // id validations
  userId = helper.checkID(userId, "UserID");
  playlistId = helper.checkID(playlistId, "PlaylistID");
  // CHECK IF THE PLAYLIST IS POSTED
  const playlistsCollection = await c.playlists();
  if (!playlistsCollection) throw `Database not found`;
  let playlist = await playlistsCollection.findOne({
    _id: new ObjectId(playlistId),
  });
  if (!playlist) throw `Could not find playlist with the id: ${playlistId}`;
  if (playlist.posted !== true)
    throw `The playlist with the id ${playlistId} is not posted`;
  // CHECK IF USER EXISTS
  const usersCollection = await c.users();
  if (!usersCollection) throw `Database not found`;
  let user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!user) throw `Could not find user with the id: ${userId}`;
  // push comment to the comment array (with the date)
  let date = new Date();
  let datePosted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  let commentObj = {
    _id: new ObjectId(),
    comment: comment,
    author: user.username,
    postDate: datePosted,
  };
  // RENDER THE USERNAME AND A LINK TO THE COMMENTER'S ACCOUNT (if we don't store this in the comments subdoc)
  let updated = await playlistsCollection.findOneAndUpdate(
    { _id: new ObjectId(playlistId) },
    { $push: { comments: commentObj } },
    { returnDocument: "after" }
  );
  if (!updated) throw `Failed to add comment!`;
  return commentObj;
};

export const addLike = async (userId, playlistId) => {
  // input validation for both ids
  userId = helper.checkID(userId, "UserID");
  playlistId = helper.checkID(playlistId, "PlaylistID");
  const playlistsCollection = await c.playlists();
  if (!playlistsCollection) throw `Database not found`;
  let playlist = await playlistsCollection.findOne({
    _id: new ObjectId(playlistId),
  });
  if (!playlist) throw `Could not find playlist with the id: ${playlistId}`;
  if (playlist.posted !== true)
    throw `The playlist with the id ${playlistId} is not posted`;
  // get and check the user collection
  const usersCollection = await c.users();
  if (!usersCollection) throw `Database not found`;
  let user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!user) throw `Could not find user with the id: ${userId}`;
  // push userId to the playlists "likes" array parameter
  let likeAdded = await playlistsCollection.findOneAndUpdate(
    { _id: new ObjectId(playlistId) },
    { $push: { likes: userId } },
    { returnDocument: "after" }
  );
  if (!likeAdded) throw `Failed to add the like to the playlist!`;
  // add the like from the user's "likedPlaylists"
  let playlistAdded = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $push: { likedPlaylists: playlistId } },
    { returnDocument: "after" }
  );
  if (!playlistAdded) throw `Failed to add the like to the user!`;
  return likeAdded.likes; // NOTE: if this passes, pass the new "likes"
};

export const removeLike = async (userId, playlistId) => {
  // input validation for both ids
  userId = helper.checkID(userId, "UserID");
  playlistId = helper.checkID(playlistId, "PlaylistID");
  // get and check the playlist collection
  const playlistsCollection = await c.playlists();
  if (!playlistsCollection) throw `Database not found`;
  let playlist = await playlistsCollection.findOne({
    _id: new ObjectId(playlistId),
  });
  if (!playlist) throw `Could not find playlist with the id: ${playlistId}`;
  if (playlist.posted !== true)
    throw `The playlist with the id ${playlistId} is not posted`;
  // get and check the user collection
  const usersCollection = await c.users();
  if (!usersCollection) throw `Database not found`;
  let user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!user) throw `Could not find user with the id: ${userId}`;
  // pull userId from the playlists "likes" array parameter
  let likeRemoved = await playlistsCollection.findOneAndUpdate(
    { _id: new ObjectId(playlistId) },
    { $pull: { likes: userId } },
    { returnDocument: "after" }
  );
  if (!likeRemoved) throw `Failed to remove the like from the playlist!`;
  // remove the like from the user's "likedPlaylists"
  let playlistRemoved = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull: { likedPlaylists: playlistId } },
    { returnDocument: "after" }
  );
  if (!playlistRemoved) throw `Failed to remove the like from the user!`;
  return likeRemoved.likes; // NOTE: if this passes, pass the new "likes"
};
