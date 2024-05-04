import axios from 'axios';
import * as c from "../config/mongoCollections.js";

export const getRecomendations = async (genres, mood, limit, accessToken, title, caption, id, username) =>{
    
    // let genreList = [
        
    //     "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal",
    //     "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop",
    //     "chicago-house", "children", "chill", "classical", "club", "comedy", "country",
    //     "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco",
    //     "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo",
    //     "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore",
    //     "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle",
    //     "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian",
    //     "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop",
    //     "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop",
    //     "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age",
    //     "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop",
    //     "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk",
    //     "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock",
    //     "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo",
    //     "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks",
    //     "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance",
    //     "trip-hop", "turkish", "work-out", "world-music", "noGenre"
    //   ];
    // if(!genreList.includes(genres[0]) ||!genreList.includes(genres[1])){throw 'genres must be one of the given options'}
    if(typeof limit != 'number'){throw 'Limit Not Number'}
    if(limit < 1){throw 'Limit too small'}
    if(limit >50){throw 'Limit must be maximum 50 songs'}
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
    let seed_artists, seed_genres;
    for(let track of response.data.items){
        tracksL.push(track.id);
    } 
    if(artists.length == 1){
        seed_artists = artists[0];
    }
    else{
        seed_artists = artists.slice(0, 2).join(",");
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
        userID: id,
        userName: username,
        title: title,
        caption: caption,
        posted: false,
        tracks: ret,
        likes: [],
        comments: []
    }

    const insertInfo = await playlistCollection.insertOne(newPlaylist);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add playlist';

    const usersCollection = await c.users();
    const user = await usersCollection.findOneAndUpdate(
        { username:  username},
        { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
        { returnOriginal: false } 
    );
    return insertInfo.insertedId.toString();
}
