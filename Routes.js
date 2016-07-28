const express = require('express');
const Router  = express.Router();
const userCtrl = require('./modules/users/userCtrl');
const vehicleCtrl = require('./modules/vehicles/vehicleCtrl');

//User API
Router.get('/api/v1/users', userCtrl.index);
Router.post('/api/v1/users', userCtrl.create);

Router.get('/api/v1/users/:userId', userCtrl.show);
Router.put('/api/v1/users/:userId', userCtrl.update);
Router.delete('/api/v1/users/:userId', userCtrl.delete);

//Vehicle API
Router.get('/api/v1/vehicles', vehicleCtrl.index);
Router.post('/api/v1/vehicles', vehicleCtrl.create);

Router.get('/api/v1/vehicles/:vehicleId', vehicleCtrl.show);
Router.put('/api/v1/vehicles/:vehicleId', vehicleCtrl.update);
Router.delete('/api/v1/vehicles/:vehicleId', vehicleCtrl.delete);


module.exports = Router;
