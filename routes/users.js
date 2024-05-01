import * as helper from '../helpers.js';
import {createUser, loginUser}from '../data/users.js';
import {Router} from 'express';
import {xss} from 'xss';
const router = Router();

router.route('/')

router.route('/register')
.get(async(req, res) => {
    if (req.session.user){
        res.redirect('/authorize');
      } else{
        res.render('register');
      }
})
.post(async(req, res) => {
    let userData = req.body;
    if (!userData || Object.keys(userData).length !== 5){
        return res.status(400).render('register', {error: "All fields need to be supplied."});
    }


    try{
      userData.firstName = xss(helper.validString(userData.firstName, "First name"));
      userData.lastName = xss(helper.validName(userData.lastName, "Last name"));
      userData.email = xss(helper.checkEmail(email));
      userData.username = xss(helper.checkUsername(username));
      userData.password = xss(helper.checkPassword(password));
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
  .get(async(req, res) =>

  


)


