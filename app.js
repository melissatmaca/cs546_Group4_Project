import express from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring'
import { generateRandomString } from './helpers.js';

dotenv.config();
let app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));


const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:3000';
const client_secret = process.env.CLIENT_SECRET;

// This it temporary for testing purposes
app.get('/authorize', (req, res) => {

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


app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});