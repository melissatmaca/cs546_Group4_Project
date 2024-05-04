import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import dotenv from 'dotenv';
import configRoutes from './routes/index.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

dotenv.config();
let app = express();

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    },
    partialsDir: ['views/partials/']
  });

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');



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
      if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/' || req.originalUrl === '/playlist/' || req.originalUrl === '/spotify/') {
            return res.redirect('/feed');
      }else{
          next();
      }
  }
});

configRoutes(app);

app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});