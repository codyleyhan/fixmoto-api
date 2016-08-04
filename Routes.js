const express = require('express');
const Router  = express.Router();
const userCtrl = require('./modules/users/userCtrl');
const vehicleCtrl = require('./modules/vehicles/vehicleCtrl');
const modCtrl = require('./modules/modifications/modCtrl');
const recordCtrl = require('./modules/records/recordCtrl');
const authCtrl = require('./modules/auth/authCtrl');


const authCheck = authCtrl.decode;
const adminCheck = authCtrl.adminCheck;


//Auth routes
Router.post('/register', authCtrl.register);
Router.post('/login', authCtrl.login);



// Add in auth middleware
Router.use('/api', authCheck);

//User API
Router.get('/api/v1/users', adminCheck, userCtrl.index);
Router.post('/api/v1/users', adminCheck, userCtrl.create);

Router.get('/api/v1/users/:userId', adminCheck, userCtrl.show);
Router.put('/api/v1/users/:userId', adminCheck, userCtrl.update);
Router.delete('/api/v1/users/:userId', adminCheck, userCtrl.delete);

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
