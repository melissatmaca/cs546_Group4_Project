import axios from 'axios';
import * as c from "../config/mongoCollections.js";

export const getRecomendations = async (genres, mood, limit, accessToken, title, caption) =>{
    if(typeof limit != 'number'){throw 'Limit Not Number'}
    if(limit < 1){throw 'Limit too small'}
    if(limit >100){throw 'Limit must be maximum 100 songs'}
    if(typeof title != 'string'){throw 'Title not string'}
    if(title.length < 1){throw 'Title too short'}
    if(title.length >36){throw 'Title must be maximum 36 characters'}
    if(typeof caption != 'string'){throw 'Caption not string'}
    if(caption.length < 1){throw 'Caption too short'}
    if(caption.length >255){throw 'Caption must be maximum 255 characters'}

    let response = await axios.get(`https://api.spotify.com/v1/me/top/artists`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    let artists = [];
    for(let artist of response.data.items){
        artists.push(artist.id);
    }
    response = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        let tracksL = [];
        for(let track of response.data.items){
            tracksL.push(track.id);
    }


    if(artists.length == 1){
        seed_artists = artists[0];
    }
    else{
        seed_artists = artists[0]+","+artists[1];
    }
    if(genres[1] == "noGenre"){
        seed_genres = genres[0];
    }
    else{
        seed_genres = genres[0]+','+genres[1];
    }

    let target_acousticness, target_danceability, target_energy, target_instrumentalness, target_liveness, target_speechiness, target_valence;
    //Values subject to testing
    if (mood === "energetic") {
        target_acousticness = 0.5;
        target_danceability = 0.7;
        target_energy = 0.8;
        target_instrumentalness = 0.4;
        target_liveness = 0.6;
        target_speechiness = 0.5;
        target_valence = 0.7;
    } else if (mood === "calm") {
        target_acousticness = 0.7;
        target_danceability = 0.4;
        target_energy = 0.3;
        target_instrumentalness = 0.7;
        target_liveness = 0.3;
        target_speechiness = 0.3;
        target_valence = 0.6;
    } else if (mood === "happy") {
        target_acousticness = 0.6;
        target_danceability = 0.8;
        target_energy = 0.7;
        target_instrumentalness = 0.2;
        target_liveness = 0.5;
        target_speechiness = 0.6;
        target_valence = 0.8;
    } else if (mood === "sad") {
        target_acousticness = 0.8;
        target_danceability = 0.3;
        target_energy = 0.2;
        target_instrumentalness = 0.8;
        target_liveness = 0.2;
        target_speechiness = 0.4;
        target_valence = 0.3;
    } else {
        target_acousticness = 0.5;
        target_danceability = 0.5;
        target_energy = 0.5;
        target_instrumentalness = 0.5;
        target_liveness = 0.5;
        target_speechiness = 0.5;
        target_valence = 0.5;
    }
    response = await axios.get('https://api.spotify.com/v1/recommendations', {
    params: {
        'limit': limit,
        'seed_artists': seed_artists,
        'seed_genres':seed_genres,
        'seed_tracks': tracksL[0],
        'target_acousticness': target_acousticness,
        'target_danceability':target_danceability,
        'target_energy': target_energy,
        'target_instrumentalness': target_instrumentalness,
        'target_liveness': target_liveness,
        'target_speechiness':target_speechiness,
        'target_valence': target_valence,
        'min_duration_ms': 150000
    },
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
    });

    let ret = [];
    for(let i = 0; i<limit; i++){
        ret.push(response.data.tracks[i].id);
    }
    const playlistCollection = await c.playlists();

    let newPlaylist = {
        userID: "n/a",
        userName: "n/a",
        title: title,
        caption: caption,
        posted: false,
        tracks: tracksL,
        likes: [],
        comments: []
    }

    const insertInfo = await playlistCollection.insertOne(newPlaylist);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add playlist';

    return insertInfo.insertedId.toString();
}
