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

export const remove = async (playlistID, username) => {
    if (!playlistID) throw 'You must provide an id to search for';
    if (typeof playlistID !== 'string') throw 'Id must be a string';
    if (playlistID.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    playlistID = playlistID.trim();
    if (!ObjectId.isValid(playlistID)) throw 'invalid object ID';
    const playlistCollection = await c.playlists();
    const deletionInfo = await playlistCollection.findOneAndDelete({_id: new ObjectId(playlistID)});

    const usersCollection = await c.users();
    const user = await usersCollection.findOneAndUpdate(
        { username:  username},
        { $pull: { createdPlaylists: playlistID} },
        { returnOriginal: false } 
    );
  
    if (!deletionInfo) { throw `Could not delete product with id of ${playlistID}`;}
    return deletionInfo.title;
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

export const addPlaylistToSpotify = async(accessToken, userID, playlistdescription, playlistName, isPublic) => {

  let headers = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  let body = {
    name: playlistName,
    description: playlistdescription,
    public: isPublic
  };
 
  
  try{
    let response = await axios.post(`https://api.spotify.com/v1/users/${userID}/playlists`, body, headers);
    return response.data
  }catch(e){
    throw{e};
  }



}
export const populatePlaylist = async(accessToken, tracks, playlistID) =>{
  let headers = {
    headers:{
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };
  let body = {
    uris: tracks
  };

  try{
    let response = await axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,body,headers);
    return response.data;
  }catch(e){
    throw{e}
  }
}