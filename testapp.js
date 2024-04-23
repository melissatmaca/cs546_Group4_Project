import express from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring'
import { getTopArtists, getTopTracks} from './data/analytics.js'
import { generateRandomString } from './helpers.js';
import axios from 'axios';
dotenv.config();
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:3000';
const client_secret = process.env.CLIENT_SECRET;

// This it temporary for testing purposes
app.get('/authorize', (req, res) => {

// Make a fucntion to generate a random string
  const state = generateRandomString();
  const scope = 'user-read-private user-read-email user-top-read';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// Some of this code can be used to get the access token for the authroized user
app.get('/', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
  
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
  
      const topArtists = await getTopTracks(access_token);
      res.send(topArtists);
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
      res.status(500).send('Internal Server Error');
    }
  });


app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});