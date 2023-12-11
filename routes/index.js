import express from 'express';
import AppController from '../controllers/AppController';
// import UsersController from '../controllers/UsersController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);
  // should return if Redis is alive and if the DB is alive
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // should return the number of users and files in DB
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // router.post('/users', (req, res) => {
  //   UsersController.postNew(req, res);
  // });

  // router.get('/connect', (req, res) => {
  //   AuthController.getConnect();
  // });
}

export default controllerRouting;
