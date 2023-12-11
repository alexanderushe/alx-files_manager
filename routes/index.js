import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

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

  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });
}

export default controllerRouting;
