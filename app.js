import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const client_id = process.env.CLIENT_ID;
console.log(client_id)
const redirect_uri = 'http://localhost:3000';

// This it temporary for testing purposes
app.get('/authorize', (req, res) => {

// Make a fucntion to generate a random string
  const state = 'aorlpdoteanfksmf';
  const scope = 'user-read-private user-read-email';

  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`);
});


app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});