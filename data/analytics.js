// All the data functions for the Analytics for each user
import axios from 'axios';

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
    if(accessToken === undefeind) throw "Error: accessToken is undefined.";
    if(limit === undefeind) throw "Error: limit is undefined.";
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


export const getSpotifyFollowers = async (accessToken) => {

    try{
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data.followers.total;
    }catch(e){
        if (e.code === 'ENOTFOUND') throw 'Error: Invalid URL';
        else if (e.response) throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else throw `Error: ${e}`;
    }
};

// Get these from the database
export const getSavedPlaylists = () => {


};

// Get these from the database
export const getLikedPlaylists = () => {


};