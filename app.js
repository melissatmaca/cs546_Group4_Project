import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import dotenv from 'dotenv';
import configRoutes from './routes/index.js';

dotenv.config();
let app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
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
      if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/') {
            return res.redirect('/feed');
      }else{
          next();
      }
  }
});

app.get('/logout', (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login')
    } else {
        next();
    }
});

configRoutes(app);

app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});