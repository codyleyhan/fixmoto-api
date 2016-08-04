const userService = require('../users/userService');
const User = require('../../models/User');
const authService = require('../auth/authService');
const jwt = require('jsonwebtoken');

const authCtrl = {
	register: function(req, res) {
		// TODO: Add email for verification

		if(!req.body.email || !req.body.password || !req.body.platform) {
			return res.status(400).json({
				message: 'Unable to register user at this time',
				error: 'Missing email, password, or platform'
			});
		}

		let message = {
			data: {
				user: null,
				token: null
			}
		};

		//checks if email already taken
		User.filter({email: req.body.email}).then(user => {
			if(user.length !== 0) {
				return res.status(400).json({
					message: 'Email is already taken.'
				});
			} else {
				return userService.addUser(req.body);
			}
		}).then(user => {
			message.data.user = user;
			message.data.user.tokens = undefined;
			message.data.user.hash = undefined;
			return authService.createToken(user, req.body.platform);
		}).then(token => {
			message.data.token = token;
			return res.status(201).json(message);
		}).catch(err => {
			return res.status(500).json({
				message: 'Unable to register user at this time',
				error: err.message
			});
		});
	},

	login: function(req, res) {
		if(!req.body.email || !req.body.password || !req.body.platform) {
			return res.status(400).json({
				message: 'Unable to login at this time',
				error: 'Missing email, password, or platform'
			});
		}


		let returnedUser;

		User.filter({email: req.body.email}).then(user => {
			if(user.length === 0) {
				let err = new Error('Email or password are incorrect');
				err.name = 'AuthenticationError';
				throw err;
			} else {
				returnedUser = user[0];
				return userService.comparePass(req.body.password, returnedUser.hash);
			}
		}).then(result => {
			if(result === true) {
				return authService.createToken(returnedUser, req.body.platform);
			} else {
				let err = new Error('Email or password are incorrect');
				err.name = 'AuthenticationError';
				throw err;
			}
		}).then(token => {
			let message = {
				data: {
					user: returnedUser,
					token
				}
			};

			//sanitizes some fields
			message.data.user.hash = undefined;
			message.data.user.tokens = undefined;

			return res.json(message);
		}).catch(err => {
			if(err.name === 'AuthenticationError') {
				return res.status(403).json({
					message: err.message
				});
			} else {
				return res.status(500).json({
					message: 'There was a problem making the request please try again.'
				});
			}
		});
	},

	verify: function(req, res) {

	},

	getForgot: function(req, res) {

	},

	postForgot: function(req, res) {

	},

	updatePass: function(req, res) {

	},

	decode: function(req, res, next) {
		const token = req.body.token || req.query.token || req.headers['x-access-token'];

		if(token) {
			jwt.verify(token, process.env.APP_SECRET, function(err, payload) {
				if(err) {
					return res.status(403).json({
						message: 'You must be signed in',
						error: 'There is a problem with your token'
					});
				}

				req.user = payload;

				req.body.userId = payload.id;
				req.body.admin = payload.admin;

				next();
			});
		} else {
			return res.status(403).json({
				message: 'You must be signed in',
				error: 'Missing token'
			});
		}
	},

	adminCheck: function(req, res, next) {
		if(req.user.admin) {
			next();
		} else {
			return res.status(403).json({
				message: 'You are not authorized',
				error: 'AuthorizationError'
			});
		}
	}
};

module.exports = authCtrl;
