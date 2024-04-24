import * as c from "../config/mongoCollections.js";
import { ObjectId, ReturnDocument } from "mongodb";

// getting the data for how the posts are viewed (social feed)
export const getFeed = async () => {
  // get the playlists that are posted
  const playlistsCollection = await c.playlists();
  if (!playlistsCollection) throw `Database not found`;
  // want only the first 5 tracks, title, caption, user, likes, comments
  let sharedPlaylists = await playlistsCollection
    .find({ shared: true })
    .toArray();
  if (!sharedPlaylists) throw `Could not retrieve playlists`;
  // I'll get the first 5 playlists later
  return sharedPlaylists;
};

// adding one comment (str: comment, str: playlistId)
export const addComment = async (comment, playlistId) => {
  // comment validation

  // playlistId validation

  // CHECK IF THE PLAYLIST IS POSTED
  const playlistsCollection = await c.playlists();
  let playlist = await playlistsCollection.findOne({
    _id: new ObjectId(playlistId),
  });
  if (!playlist) throw `Could not find playlist with the id: ${playlistId}`;
  if (playlist.posted !== true)
    throw `The playlist with the id ${playlistId} is not posted`;
  // push comment to the comment array (with the date)
  let date = new Date();
  let datePosted = `${date.toLocaleDateString} ${date.toLocaleTimeString}`;
  let commentObj = { _id: new ObjectId(), comment: comment };
  // RENDER THE USERNAME AND A LINK TO THE COMMENTER'S ACCOUNT (if we don't store this in the comments subdoc)
  let updated = await playlistsCollection.findOneAndUpdate(
    { _id: new ObjectId(playlistId) },
    { $push: { comments: commentObj } },
    { returnDocument: "after" }
  );
  if (!updated) throw `Failed to add comment!`;
  return updated;
};
