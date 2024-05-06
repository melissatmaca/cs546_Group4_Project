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
  if (!playlist) throw 'No playlist with that id';
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
    await remFromLiked(playlistID);

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

export const remFromLiked = async (playlistID) => {
  if (!playlistID) throw 'You must provide an id to search for';
  if (typeof playlistID !== 'string') throw 'Id must be a string';
  if (playlistID.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  playlistID = playlistID.trim();
  if (!ObjectId.isValid(playlistID)) throw 'invalid object ID';
  const playlistCollection = await c.playlists();
  const usersCollection = await c.users();
  
  const playlist = await playlistCollection.findOne({_id: new ObjectId(playlistID)});
  let likers = playlist.likes;
  for(const userID of likers){
    const user = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      { $pull: { likedPlaylists: playlistID} },
      { returnOriginal: false } 
    );
  }

  const updateResult = await playlistCollection.updateOne(
    { _id: new ObjectId(playlistID) },
    { $set: { likes: []} }
  );
}

export const changePost = async (playlistID) => {
    if (!playlistID) throw 'You must provide an id to search for';
    if (typeof playlistID !== 'string') throw 'Id must be a string';
    if (playlistID.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    playlistID = playlistID.trim();
    if (!ObjectId.isValid(playlistID)) throw 'invalid object ID';
    const playlistCollection = await c.playlists();
    const playlist = await playlistCollection.findOne({_id: new ObjectId(playlistID)});
    if (!playlist) throw 'No playlist with that id';
    const updatedPosted = !playlist.posted;
    if(!updatedPosted){
      await remFromLiked(playlistID);
    }

    const updateResult = await playlistCollection.updateOne(
        { _id: new ObjectId(playlistID) },
        { $set: { posted: updatedPosted } }
    );
  };
 
  export const changeLike = async (playlistID, userID) => {
    if (!playlistID) throw 'You must provide an id to search for';
    if (typeof playlistID !== 'string') throw 'Id must be a string';
    if (playlistID.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    playlistID = playlistID.trim();
    if (!ObjectId.isValid(playlistID)) throw 'invalid object ID';
    const playlistCollection = await c.playlists();
    const usersCollection = await c.users();
    
    const playlist = await playlistCollection.findOne({_id: new ObjectId(playlistID)});
    if (!playlist) throw 'No playlist with that id';
    if(playlist.userID === userID) throw `You cannot like your own playlist!`;
    if(playlist.likes.includes(userID)){
      const updateResult = await playlistCollection.updateOne(
        { _id: new ObjectId(playlistID) },
        { $pull: { likes: userID} }
      );
      const user = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userID) },
        { $pull: { likedPlaylists: playlistID} },
        { returnOriginal: false } 
      );
    }
    else{
      const updateResult = await playlistCollection.updateOne(
        { _id: new ObjectId(playlistID) },
        { $push: { likes: userID} }
      );
      const user = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userID) },
        { $push: { likedPlaylists: playlistID} },
        { returnOriginal: false } 
      );
    }
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

