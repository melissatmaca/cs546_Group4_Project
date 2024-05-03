import {Router} from 'express';
import * as socialData from "../data/social.js";
import {ObjectId} from 'mongodb';
const router = Router();

import * as PG from '../data/playlistGeneration.js'
import {get, getAll, getAllPosted, remove, getPlaylistJSON, addPlaylistToSpotify, populatePlaylist} from '../data/playlists.js' 
import { playlists, users } from '../config/mongoCollections.js';

import * as helper from '../helpers.js';
import {createUser, loginUser} from '../data/users.js';
import xss from 'xss';

import * as analytics from '../data/analytics.js';
import querystring from 'querystring';
import axios from 'axios';

router.route('/').get(async (req, res) => {
  res.redirect('/login');
  return;
});

router.route('/generator')
  .get(async (req, res) => {
    res.render('generator', {title: "Generator", loggedIn: true});
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
    if(!genreList.includes(genres[0]) ||!genreList.includes(genres[1])){throw 'genres must be one of the given options'}
    if(typeof mood != 'string'){throw 'mood must be a string'}
    if(mood != "energetic" && mood != "calm" && mood != "sad" && mood != "happy" && mood != "no mood" ){throw 'mood must be one of the given options'}
    limit = parseInt(limit);
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

    return res.status(400).render("generator", ({title: "generator", Error: Error}))
}

try{
    let genRet = await PG.getRecomendations(genres, mood, limit, accessToken, title, caption, req.session.user.id, req.session.user.username);

    if (genRet) {
      res.redirect(`/playlist/${genRet}`);
    } else {
      res.render('generator', { title: "generator", Error: 'Failed to generate playlist', loggedIn: true });
    }
  } catch (error) {
    return res.status(400).render("generator", { title: "generator", Error: error });
  }
});



  router
  .route('/playlist/:id')
  .get(async (req, res) => {
    let playlistID;
    try {
      playlistID = req.params.id;
      if (!playlistID) throw 'You must provide an id to search for';
      if (typeof playlistID !== 'string') throw 'Id must be a string';
      playlistID = playlistID.trim();
      if (playlistID.length === 0) throw 'id cannot be an empty string or just spaces';
      if (!ObjectId.isValid(playlistID)) throw "Not Valid ID";
    } catch (e) {
      console.log(e);
      return res.status(400).json({error: e});
    }
    //try getting the post by ID
    let playlist, playlistData, playlistTitle, ownerName, caption, isOwner, id;
    try {
      playlist = await get(req.params.id.trim());
    } catch (e) {
      return res.status(404).json({error: e});
    }
    
    try{
      playlistData = await getPlaylistJSON(playlist.tracks, req.session.user.accessToken);
      playlistTitle = playlist.title;
      ownerName = playlist.userName;
      caption = playlist.caption;
      isOwner = (req.session.user.id == playlist.userID);
      id = req.session.user.id;
    } catch(e){
      console.log(e);
      return res.status(404).json({error: e});
    }
    res.render('playlist', { 
      playlistData,
      playlistTitle,
      ownerName,
      caption,
      isOwner,
      playlistID: playlistID, 
      loggedIn: true
  });
  })
  .post(async (req, res) => {
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
      return res.redirect('/feed');
    } catch (e) {
      console.log(e);
      return res.status(404).json({error: e});
    }
  });

  router.post('/saveplaylist',async (req,res) => {
    let accessToken = req.body.accessToken
    let userID = req.body.userID
    let playlistName = req.body.name
    let description = req.body.description
    let tracks = req.body.tracks
    let isPublic = req.body.isPublic

    try{
      let newSpotifyPlaylist = await addPlaylistToSpotify(accessToken,userID,description, playlistName, isPublic);
      let newPlaylistID = newSpotifyPlaylist.id;

      let populateNewSpotifyPlaylist = await populatePlaylist(accessToken,tracks,newPlaylistID,)
      return newSpotifyPlaylist + populateNewSpotifyPlaylist;
    }catch(e){
      return res.status(500).json("error: " + e)
    }
  })


  // social feed routes
  router
  .route('/feed')
  .get(async (req, res) => {
    let feed = undefined;
    try {
      feed = socialData.getFeed();
    } catch(e) {
      console.log(e);
      return res.status(400).json({error: e});
    }
    // if we get the feed, render socialFeed
    res.render('socialFeed', {loggedIn: true, playlists:feed, script_partial:'like_and_comment_ajax'});
  })

router.route('/register')
  .get(async(req, res) => {
      if (req.session.user){
          res.redirect('/authorize');
        } else{
          res.render('register', {title: "Register", loggedIn: false});
        }
  })
  .post(async(req, res) => {
      let userData = req.body;
      if (!userData){
          return res.status(400).render('register', {error: "All fields need to be supplied."});
      }

      try{
        userData.firstName = xss(helper.checkString(userData.firstName, "First name"));
        userData.lastName = xss(helper.checkString(userData.lastName, "Last name"));
        userData.email = xss(helper.checkEmail(userData.email));
        userData.username = xss(helper.checkUsername(userData.username));
        userData.password = xss(helper.checkPassword(userData.password));
      } catch(e){
        return res.status(400).render('register', {error: e});
      }

      if(userData.password !== userData.confirmPassword){
        return res.status(400).render('register', {error: "Passwords do not match."});
      }
      
      try{
        const newUser = await createUser(userData.firstName, userData.lastName, userData.email, userData.username, userData.password);
        res.redirect('/login');
        req.session.user = newUser;
      } catch (e){
        return res.status(400).render('register', {error: e});
      }
    });


    router.route('/login')
    .get(async(req, res) => {
      if (req.session.user){
        res.redirect('/authorize');
      } else{
        res.render('login', {title: "Login", loggedIn: false});
      };
  })
  .post(async(req, res) => {
      let userData = req.body;
      if (!userData || Object.keys(userData).length !== 3){
          return res.status(400).render('login', {error: "All fields need to be supplied."});
      };

      try{
        userData.username = xss(helper.checkUsername(userData.username));
        userData.password = xss(helper.checkPassword(userData.password));
      } catch(e){
        return res.status(400).render('login', {error: e});
      }

      let loggedUser = undefined;
      try {
        loggedUser = await loginUser(userData.username, userData.password);
        req.session.user = loggedUser;
        req.session.user.id = loggedUser._id.toString();
      } catch(e) {
        return res.status(400).render('login', {error: "Invalid username and/or password."});
      }

      return res.redirect('/authorize');
  })
    
router.route('/authorize').get(async(req, res) => {

  const state = helper.generateRandomString();
  const scope = 'user-read-private user-read-email user-top-read';
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = 'http://localhost:3000/accessToken';
  const client_secret = process.env.CLIENT_SECRET;

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));

});

router.route('/accessToken').get( async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const client_id = process.env.CLIENT_ID;
    const redirect_uri = 'http://localhost:3000/accessToken';
    const client_secret = process.env.CLIENT_SECRET;
  
    if (state === null) {
      res.status(400).send('State mismatch error');
      return;
    }
  
    try {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
          };
  
        const response = await axios.post(authOptions.url, authOptions.form, {headers: authOptions.headers});
        const access_token = response.data.access_token;
        req.session.user.accessToken = access_token;
        res.redirect('/feed');
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.route('/profile').get(async (req, res) => {
    let numFollowers = undefined;
    let topTracks = undefined;
    let topArtists = undefined;
    let likedPlaylists = undefined;
    let savedPlaylists = undefined;
    let genreBreakdown = undefined;
    try{
      topArtists = await analytics.getTopArtists(req.session.user.accessToken, 10);
      topTracks = await analytics.getTopArtists(req.session.user.accessToken, 10);
      numFollowers = await analytics.getSpotifyFollowers(req.session.user.accessToken);
      likedPlaylists = await analytics.getLikedPlaylists(req.session.user.username);
      savedPlaylists = await analytics.getSavedPlaylists(req.session.user.username);
      genreBreakdown = await analytics.getGenreBreakdown(req.session.user.accessToken);
    }catch(e){
      return res.status(500).json({error: "Internal Server Error"});
    }

    return res.render('./profile', {title: "Profile", loggedIn: true, username: req.session.username, numFollowers: numFollowers, topTrakcs: topTracks, 
                      topArtists: topArtists, genres: genreBreakdown, likedPlaylists: likedPlaylists, savedPlaylists: savedPlaylists});

  });

  export default router;
