// All the data functions for the Analytics for each user
import axios from 'axios';
import {ObjectId} from 'mongodb';
import { playlists, users } from '../config/mongoCollections.js';

export const getTopArtists = async (accessToken, limit) =>{
    if(accessToken === undefined) throw "Error: accessToken is undefined.";
    if(limit === undefined) throw "Error: limit is undefined.";
    if(typeof accessToken !== 'string') throw "Error: accessToken is not a string.";
    if(typeof limit !== 'number') throw "Error: accessToken is not a number.";

    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/artists`, {
            params: {
                'limit': limit
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        let topArtists = [];
        for(let artist of response.data.items){
            topArtists.push(artist.name);
        }
        return topArtists;
    }catch(e){
        if (e.code === 'ENOTFOUND') throw 'Error: Invalid URL';
        else if (e.response) throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else throw `Error: ${e}`;
    }
};

export const getTopTracks = async (accessToken, limit) =>{
    if(accessToken === undefined) throw "Error: accessToken is undefined.";
    if(limit === undefined) throw "Error: limit is undefined.";
    if(typeof accessToken !== 'string') throw "Error: accessToken is not a string.";
    if(typeof limit !== 'number') throw "Error: accessToken is not a number.";

    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
            params: {
                'limit': limit
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        let topTracks = [];
        for(let track of response.data.items){
            topTracks.push(track.name);
        }
        return topTracks;
    }catch(e){
        if (e.code === 'ENOTFOUND') throw 'Error: Invalid URL';
        else if (e.response) throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else throw `Error: ${e}`;
    }
};

export const getGenreBreakdown = async (accessToken) => {
    if(accessToken === undefined) throw "Error: accessToken is undefined.";
    if(typeof accessToken !== 'string') throw "Error: accessToken is not a string.";

    let response = []
    try{
        response = await axios.get(`https://api.spotify.com/v1/me/top/artists`, {
            params: {
                'limit': 50
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

    }catch(e){
        if (e.code === 'ENOTFOUND') throw 'Error: Invalid URL';
        else if (e.response) throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else throw `Error: ${e}`;
    }

    let countOfGenres = {};
    let totalGenres = 0;
    for(let artist of response.data.items){
        for(let genre of artist.genres){
            if (!countOfGenres[genre]) {
                countOfGenres[genre] = 1;
            } else {
                countOfGenres[genre] += 1;
            }
            totalGenres++;
        }
    }

    for(let genre in countOfGenres){
        countOfGenres[genre] = Math.floor(((countOfGenres[genre]/totalGenres)*10000))/100;

    }

    return countOfGenres;
};


export const getSpotifyUserInfo = async (accessToken) => {

    try{
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    }catch(e){
        if (e.code === 'ENOTFOUND') throw 'Error: Invalid URL';
        else if (e.response) throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else throw `Error: ${e}`;
    }
};

// Get these from the database
export const getCreatedPlaylists = async (username) => {
    const userCollection = await users();
    const user = await userCollection.findOne({username: username});

    if(!user) throw 'Error: no user with taht username exists';

    let usersPlaylists = [];
    for(let playlistId of user.createdPlaylists){
        const playlistCollection = await playlists();
        const playlist = await playlistCollection.findOne({_id: new ObjectId(playlistId)});
        usersPlaylists.push(playlist);
    }

    return usersPlaylists;
};

// Get these from the database
export const getLikedPlaylists = async (username) => {
    // const userCollection = await users();
    // const user = await userCollection.findOne({username: username});

    // if(!user) throw 'Error: no user with taht username exists';

    // let usersPlaylists = [];
    // for(let playlistId of user.likedPlaylists){
    //     const playlistCollection = await playlists();
    //     const playlist = await playlistCollection.findOne({_id: new ObjectId(playlistId)});
    //     usersPlaylists.push(playlist);
    // }

    // return usersPlaylists;
};