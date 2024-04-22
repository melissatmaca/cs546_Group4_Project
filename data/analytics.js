// All the data functions for the Analytics for each user
import axios from 'axios';

export const getTopArtists = async (accessToken) =>{
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/artists`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        let topArtists = [];
        for(let artist of response.data.items){
            topArtists.push(artist.album.name);
        }
        return topArtists;
    }catch(e){
        if (e.code === 'ENOTFOUND') throw 'Error: Invalid URL';
        else if (e.response) throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else throw `Error: ${e}`;
    }
};

export const getTopTracks = async (accessToken) =>{
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
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