import * as c from "../config/mongoCollections.js";
import axios from 'axios';
import {ObjectId} from 'mongodb';

export const getAll = async () => {
  const playlistCollection = await c.playlists();
  const playlistList = await playlistCollection.find({}).toArray();
  if (!playlistList) throw 'Could not get all playlists';
  return playlistList;
};

export const getAllPosted = async () => {
    const playlistCollection = await c.playlists();
    const playlistList = await playlistCollection.find({posted: true}).toArray();
    if (!playlistList) throw 'Could not get all playlists';
    return playlistList;
  };

export const get = async (playlistID) => {
  if (!playlistID) throw 'You must provide an id to search for';
  if (typeof playlistID !== 'string') throw 'Id must be a string';
  if (playlistID.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  playlistID = playlistID.trim();
  if (!ObjectId.isValid(playlistID)) throw 'invalid object ID';
  const playlistCollection = await c.playlists();
  const playlist = await playlistCollection.findOne({_id: new ObjectId(playlistID)});
  if (!playlist) throw 'No product with that id';
  playlist._id = playlist._id.toString();
  return playlist;
};

export const remove = async (playlistID) => {
    if (!playlistID) throw 'You must provide an id to search for';
    if (typeof playlistID !== 'string') throw 'Id must be a string';
    if (playlistID.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    playlistID = playlistID.trim();
    if (!ObjectId.isValid(playlistID)) throw 'invalid object ID';
    const playlistCollection = await c.playlists();
    const deletionInfo = await playlistCollection.findOneAndDelete({_id: new ObjectId(playlistID)});
  
    if (!deletionInfo) { throw `Could not delete product with id of ${playlistID}`;}
    return `${deletionInfo.title} has been successfully deleted!`;
  };

export const getPlaylistJSON = async (arr, accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/tracks', {
    params: {
      'ids': arr.join()
    },
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data.tracks;
}