import {Router} from 'express';
import * as socialData from "../data/social.js";
const router = Router();
import {ObjectId} from 'mongodb'; 

import * as PG from '../data/playlistGeneration.js'
import {get, getAll, getAllPosted, remove, getPlaylistJSON, addPlaylistToSpotify, populatePlaylist, getSpotifyID} from '../data/playlists.js' 
import { playlists, users } from '../config/mongoCollections.js';

import * as helper from '../helpers.js';
import {createUser, loginUser} from '../data/users.js';
import xss from 'xss';

import * as analytics from '../data/analytics.js';
import querystring from 'querystring';
import axios from 'axios';

import {ChartJSNodeCanvas} from 'chartjs-node-canvas';
import { userInfo } from 'os';

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
    if(limit >50){throw 'Limit must be maximum 50 songs'}
    if(typeof title != 'string'){throw 'Title not string'}
    if(title.length < 1){throw 'Title too short'}
    if(title.length >36){throw 'Title must be maximum 36 characters'}
    if(typeof caption != 'string'){throw 'Caption not string'}
    if(caption.length < 1){throw 'Caption too short'}
    if(caption.length >255){throw 'Caption must be maximum 255 characters'}
}catch(Error){
    console.log(Error);
    res.status(400).render("generator", ({title: "generator", Error: Error}))
}

    try{
    let genRet = await PG.getRecomendations(genres,mood,limit,accessToken,title,caption, req.session.user.id, req.session.user.username);

    if(genRet){
    res.redirect(`/playlist/${genRet}`);
    }
  }catch(e){
    res.render('generator', {title:"generator", Error: e, loggedIn: true})
    console.log(e);
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
      // console.log(e);
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
    } catch(e){
      //console.log(e);
      return res.status(404).json({error: e});
    }
    res.render('playlist', { 
      playlistData,
      playlistTitle,
      ownerName,
      caption,
      isOwner,
      playlistID,
      loggedIn: true, 
      title: playlistTitle
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
      console.log(e);
      return res.status(400).json({error: e});
    }
    //try to delete post
    try {
      
      let deletedPlaylist = await remove(req.params.id.trim(), req.session.user.username);
      res.render('delete', {title: 'Deleted Playlist', loggedIn: true, playlist: deletedPlaylist});
    } catch (e) {

      return res.status(404).json({error: e});
    }
  })
  router
  .route('/spotify/:id')
  .post(async (req, res) => {
    let userSpotifyID=null;
    
    try{
      let userInfo = await getSpotifyID(req.session.user.accessToken);
      userSpotifyID = userInfo;
    }catch(e){
      console.log(e)
      return res.status(400).json({error: e});
    }

    let SpotifyPlaylistID=null;
    try {
      let playlistInfo = await get(req.params.id);
      let savedPlaylist = await addPlaylistToSpotify(req.session.user.accessToken,userSpotifyID,playlistInfo.caption, playlistInfo.title);
      SpotifyPlaylistID = savedPlaylist;

    }catch(e){
      return res.status(500).json({error: e});
    }


    try {
      let playlistInfo = await get(req.params.id);
      let filledPlaylist = await populatePlaylist(req.session.user.accessToken,playlistInfo.tracks, SpotifyPlaylistID);
    } catch (error) {
      return res.status(500).json({error: error});
    }
    res.render('./playlistadded', {loggedIn: true})
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
    // get the tracks with these IDs, limited up to 5 (to not "clog" the feed)
    let fullFeed = undefined;
    try {
      // async allows me to call getPlaylistJSON
      // ... preserves the keys and data of feed as we copy it over to fullFeed
      fullFeed = feed.map(async playlist => ({...playlist, trackData: await getPlaylistJSON(playlist.tracks.slice(0,5), req.session.user.accessToken)}))
    } catch(e) {
      return res.status(400).json({error: e});
    }
    res.render('./socialFeed', {playlists:fullFeed, script_partial:'like_and_comment_ajax'});
  })

    // AJAX routes for like and comment
  router
  .route('/api/playlist/:playlistId/like')
  .post(async (req, res) => {
    // get all the playlist info
    let playlistId = undefined;
    let playlist = undefined;
    let playlistsCollection = undefined;
    try {
      playlistId = req.params.playlistId;
      playlistId = helper.checkID(playlistId, "PlaylistID");
      playlistsCollection = await playlists();
      if (!playlistsCollection) throw `Database not found`;
      playlist = await playlistsCollection.findOne({
        _id: new ObjectId(playlistId),
      });
      if (!playlist) throw `Could not find playlist with the id: ${playlistId}`;
    } catch(e) {
      return res.status(400).json({error: e});
    }

    // check whether to add or remove like
    let likeResult = undefined;
    // remove like
    if (playlist.likes.includes(req.session.user._id)) {
      try {
        likeResult = await socialData.removeLike(req.session.user._id, playlistId);
      } catch(e) {
        return res.status(400).json({error: e});
      }
    } else {
      // add like
      try { 
        likeResult = await socialData.addLike(req.session.user._id, playlistId);
      } catch(e) {
        return res.status(400).json({error: e});
      }
    }
    res.json({ likes: likeResult });
  })

  router
  .route('/api/playlist/:playlistId/comment')
  .post(async (req, res) => {
    // get all the playlist info
    let playlistId = undefined;
    let playlist = undefined;
    let playlistsCollection = undefined;
    try {
      playlistId = req.params.playlistId;
      playlistId = helper.checkID(playlistId, "PlaylistID");
      playlistsCollection = await playlists();
      if (!playlistsCollection) throw `Database not found`;
      playlist = await playlistsCollection.findOne({
        _id: new ObjectId(playlistId),
      });
      if (!playlist) throw `Could not find playlist with the id: ${playlistId}`;
    } catch(e) {
      return res.status(400).json({error: e});
    }
    // fetch the comment
    let comment = undefined;
    try {
      comment = req.body.comment;
      comment = helper.checkComment(comment, "Comment");
      comment = xss(comment); // "clean" the textarea input
    } catch(e) {
      return res.status(400).json({error: e});
    }
    // add the comment
    let commentAdded = undefined;
    try {
      commentAdded = await socialData.addComment(comment, req.session.user._id, playlistId);
    } catch(e) {
      return res.status(400).json({error: e});
    }
    res.json({comments:commentAdded});
  })

router.route('/register')
  .get(async(req, res) => {
      if (req.session.user){
          res.redirect('/authorize');
        } else{
          res.render('register', {title: 'Register'});
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
        res.render('login', {title: 'Login'});
      };
  })
  .post(async(req, res) => {
      let userData = req.body;
      if (!userData || Object.keys(userData).length !== 2){
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
  const scope = 'user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public';
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
    let topTracks = undefined;
    let topArtists = undefined;
    let likedPlaylists = undefined;
    let numFollowers = undefined;
    let createdPlaylists = undefined;
    let genreBreakdown = undefined;
    let spotifyUsername = undefined;
    let userInfo = undefined;

    try{
      topArtists = await analytics.getTopArtists(req.session.user.accessToken, 10);
      topTracks = await analytics.getTopTracks(req.session.user.accessToken, 10);
      userInfo = await analytics.getSpotifyUserInfo(req.session.user.accessToken);
      numFollowers = userInfo.followers.total;
      spotifyUsername = userInfo.display_name;
      likedPlaylists = await analytics.getLikedPlaylists(req.session.user.username);
      createdPlaylists = await analytics.getCreatedPlaylists(req.session.user.username);
      genreBreakdown = await analytics.getGenreBreakdown(req.session.user.accessToken);
    }catch(e){
      return res.status(500).render('./profile', {error: "Error: Unable to load profile, please refresh and try again.", loggedIn: true});
    }

    const labels = Object.keys(genreBreakdown);
    const data = Object.values(genreBreakdown);
    const chartNode = new ChartJSNodeCanvas({ width: 400, height: 400 });

    const chartData = {
      type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: helper.getRandomColors(labels.length),
                    borderColor: 'black',
                }]
            },
          options: {
            plugins: {
              legend: {
                  display: true,
                  position: 'left', 
                  labels: {
                      font: {
                          size: 16 
                      },
                      color: 'black',
                  }
              },
          },
          responsive: true
          }
    };
    let genrePieChart = await chartNode.renderToBuffer(chartData);
    genrePieChart = `data:image/png;base64,${genrePieChart.toString('base64')}`;
    return res.render('./profile', {title: "Profile", loggedIn: true, spotifyUsername: spotifyUsername, username: req.session.user.username, numFollowers: numFollowers, topTracks: topTracks, 
                      topArtists: topArtists, genres: genrePieChart, likedPlaylists: likedPlaylists, createdPlaylists: createdPlaylists});

  });

  router.route('/logout').get(async (req, res) => {
    req.session.destroy();
  });

  export default router;
