import Routes from './Routes.js';

const constructorMethod = (app) => {

  app.use('/', Routes);

  app.use('*', (req, res) => {
    res.redirect("login", ({title: "login"}));
  });
};

export default constructorMethod;