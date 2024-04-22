import axios from 'axios';

export const getRecomendations = async (artists, genres,tracks, mood, limit) =>{
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
    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
    params: {
        'limit': limit,
        'seed_artists': artists.join(),
        'seed_genres': genres.join(),
        'seed_tracks': tracks.join(),
        'target_acousticness': target_acousticness,
        'target_danceability':target_danceability,
        'target_energy': target_energy,
        'target_instrumentalness': target_instrumentalness,
        'target_liveness': target_liveness,
        'target_speechiness':target_speechiness,
        'target_valence': target_valence
    },
    headers: {
        'Authorization': 'Example'
    }
    });
    let ret = [];
    for(let i = 0; i<limit; i++){
        ret.push(response.tracks[i].id);
    }
    return ret;
}