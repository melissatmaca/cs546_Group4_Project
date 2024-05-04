import * as c from "../config/mongoCollections.js";
import axios, { all } from 'axios';
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

export const getSpotifyID = async(accessToken) => {
try{
    let userInfo = await axios.get(`https://api.spotify.com/v1/me`,
      {headers:{
        'Authorization' : `Bearer ${accessToken}`,
      }}
    );
    if(!userInfo){
      throw "could not fetch user info"
      }
      let spotifyUserid=userInfo.data.id;
    return spotifyUserid;
}catch(e){
  throw e
}};

export const addPlaylistToSpotify = async(accessToken, spotifyUserid, playlistdescription, playlistName) => {
try{

  
    let response = await axios.post(`https://api.spotify.com/v1/users/${spotifyUserid}/playlists`, 
    { 
    'name': playlistName,
    'description': playlistdescription,
    'public': false
    },
    {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
    });
    return response.data.id
  }catch(e){
    throw{e};
  }
}
export const populatePlaylist = async(accessToken, tracks, playlistID) =>{

  for(let i =0; i <tracks.length; i++){
    // if(i==tracks.length-1){
    tracks[i] = 'spotify:track:' + tracks[i];
    // }else{
    //   tracks[i] = 'spotify:track:' + tracks[i] +',';
    // }
  }

  console.log(tracks);
  try{
    let response = await axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
    {
      uris: tracks
    },
    {
      headers:{
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }catch(e){
    throw{e}
  }
}