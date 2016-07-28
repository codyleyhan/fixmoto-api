const express = require('express');
const Router  = express.Router();
const userCtrl = require('./modules/users/userCtrl');

Router.get('/api/v1/users', userCtrl.index);
Router.post('/api/v1/users', userCtrl.create);


Router.get('/api/v1/users/:userId', userCtrl.show);
Router.put('/api/v1/users/:userId', userCtrl.update);
Router.delete('/api/v1/users/:userId', userCtrl.delete);

module.exports = Router;
