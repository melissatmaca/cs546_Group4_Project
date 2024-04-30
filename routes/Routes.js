import {Router} from 'express';
const router = Router();

import * as PG from '../data/playlistGeneration'
import {get, getAll, getAllPosted, remove} from '../data/playlists.js' 

router.route('/').get(async (req, res) => {

  res.redirect('/login');
  return;
});

  router
  .route('/generator')
  .get(async (req, res) => {
    res.render('generator', {title: "generator"});
  })
  .post(async (req, res) => {
    //code here for POST

    let title = req.body.title.trim();
    let caption = req.body.caption.trim();
    let limit = req.body.limit;
    let genres = [req.body.firstGenre, req.body.secondGenre];
    let mood = req.body.mood;
    let accessToken = req.session.user.accessToken;

    let genreList = [
        
        "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal",
        "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop",
        "chicago-house", "children", "chill", "classical", "club", "comedy", "country",
        "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco",
        "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo",
        "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore",
        "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle",
        "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian",
        "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop",
        "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop",
        "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age",
        "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop",
        "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk",
        "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock",
        "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo",
        "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks",
        "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance",
        "trip-hop", "turkish", "work-out", "world-music", "noGenre"
      ];
      

try{
    if(typeof genres[0] != 'string'){throw 'genres must be a string'}
    if(typeof genres[1] != 'string'){throw 'genres must be a string'}
    if(!genreList.includes(genre[0]) ||!genreList.includes([1])){throw 'genres must be one of the given options'}
    if(typeof mood != 'string'){throw 'mood must be a string'}
    if(mood != "energetic" && mood != "calm" && mood != "sad" && mood != "happy" && mood != "no mood" ){throw 'mood must be one of the given options'}
    if(typeof limit != 'number'){throw 'Limit Not Number'}
    if(limit < 1){throw 'Limit too small'}
    if(limit >100){throw 'Limit must be maximum 100 songs'}
    if(typeof title != 'string'){throw 'Title not string'}
    if(title.length < 1){throw 'Title too short'}
    if(title.length >36){throw 'Title must be maximum 36 characters'}
    if(typeof caption != 'string'){throw 'Caption not string'}
    if(caption.length < 1){throw 'Caption too short'}
    if(caption.length >255){throw 'Caption must be maximum 255 characters'}
}catch(Error){
    res.status(400).render("generator", ({title: "generator", Error: Error}))
}

    try{
    let genRet = await PG.getRecomendations(genres,mood,limit,accessToken,title,caption);

    if(genRet){
    res.redirect('/playlistPage');
    }
  }catch(e){
    res.render('generator', {title:"generator", Error: e})
  }
  });  



  router
  .route('/playlist/:id')
  .get(async (req, res) => {
    try {
      let playlistID = req.params.id;
      if (!playlistID) throw 'You must provide an id to search for';
      if (typeof playlistID !== 'string') throw 'Id must be a string';
      playlistID = playlistID.trim();
      if (playlistID.length === 0) throw 'id cannot be an empty string or just spaces';
      if (!ObjectId.isValid(playlistID)) throw "Not Valid ID";
    } catch (e) {
      // console.log(e);
      return res.status(400).json({error: e});
    }
    //try getting the post by ID
    try {
      const playlist = await get(req.params.id.trim());
      return res.json(playlist);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })
  .delete(async (req, res) => {
    try {
      let playlistID = req.params.id;
      if (!playlistID) throw 'You must provide an id to search for';
      if (typeof playlistID !== 'string') throw 'Id must be a string';
      playlistID = playlistID.trim();
      if (playlistID.length === 0) throw 'id cannot be an empty string or just spaces';
      if (!ObjectId.isValid(playlistID)) throw "Not Valid ID";
    } catch (e) {
      return res.status(400).json({error: e});
    }
    //try to delete post
    try {
      
      let deletedPlaylist = await remove(req.params.id.trim());
      return res.json(deletedPlaylist);
    } catch (e) {
      console.log(e);
      return res.status(404).json({error: e});
    }
  })