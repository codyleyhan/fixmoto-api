const express = require('express');
const Router  = express.Router();
const userCtrl = require('./modules/users/userCtrl');
const vehicleCtrl = require('./modules/vehicles/vehicleCtrl');
const modCtrl = require('./modules/modifications/modCtrl');
const recordCtrl = require('./modules/records/recordCtrl');


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


//Modification API
Router.get('/api/v1/modifications', modCtrl.index);
Router.post('/api/v1/modifications', modCtrl.create);

Router.get('/api/v1/modifications/:modId', modCtrl.show);
Router.put('/api/v1/modifications/:modId', modCtrl.update);
Router.delete('/api/v1/modifications/:modId', modCtrl.delete);

//Record API
Router.get('/api/v1/records', recordCtrl.index);
Router.post('/api/v1/records', recordCtrl.create);

Router.get('/api/v1/records/:recordId', recordCtrl.show);
Router.put('/api/v1/records/:recordId', recordCtrl.update);
Router.delete('/api/v1/records/:recordId', recordCtrl.delete);

module.exports = Router;
