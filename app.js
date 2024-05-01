import express from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring'
import { generateRandomString } from './helpers.js';

dotenv.config();
let app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:3000/accessToken';
const client_secret = process.env.CLIENT_SECRET;

app.use(
  session({
      name: 'AuthenticationState',
      secret: 'some secret string!',
      resave: false,
      saveUninitialized: false
  })
);

app.use('/', (req, res, next) =>{
  if(!req.session.user){
      if (req.originalUrl === '/login' || req.originalUrl === '/register') {
          next(); 
      } else{
          return res.redirect('/login'); 
      }
  }else{
      if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/') {
            return res.redirect('/feed');
      }else{
          next();
      }
  }
});


app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});