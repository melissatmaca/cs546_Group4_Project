import Routes from './Routes.js';

const constructorMethod = (app) => {

  app.use('/', Routes);

  app.use('*', (req, res) => {
    res.render("./login", ({title: "login"}));
  });
};

export default constructorMethod;