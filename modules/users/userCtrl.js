const userService = require('./userService');

const userCtrl = {
	index: function(req, res) {
		const limit = parseInt(req.query.limit) || parseInt(req.body.limit) || 10;
		const offset = parseInt(req.query.offset) || parseInt(req.body.offset) || 0;

		userService.getAll(limit, offset).then(result => {
			const message = {
				meta: {
					limit,
					offset,
					count: result.count
				},
				data: {
					users: result.users
				}
			};

			return res.json(message);
		}).catch(err => {
			return res.json({
				message: 'There was a problem making the request',
				error: err.message
			});
		});
	},

	show: function(req, res) {
		const id = req.params.userId || req.body.userId;

		userService.getUser(id).then(user => {
			const message = {
				data: {
					user
				}
			};

			return res.json(message);
		}).catch(err => {
			if(err.name !== 'DocumentNotFoundError') {
				err = undefined;
			}
			const message = {
				message: 'There was a problem making your request',
				error: err.message
			};

			return res.status(404).json(message);
		});
	},

	create: function(req, res) {
		if(!req.body.email || !req.body.password) {
			const message = {
				message: 'There was a problem making your request',
				error: 'Unable to create user due to missing email or password.'
			};

			return res.status(400).json(message);
		}
		userService.addUser(req.body).then(user => {
			const message = {
				data: user
			};

			return res.status(201).json(message);
		}).catch(err => {
			const message = {
				message: 'There was a problem making your request',
				error: err.message
			};

			return res.status(400).json(message);
		});
	},

	delete: function(req, res) {
		userService.deleteUser(req.params.userId).then(result => {
			if(result === true) {
				const message = {
					message: `The user with id of ${req.params.userId} has been deleted`
				};

				return res.status(200).json(message);
			}
		}).catch(err => {
			const message = {
				message: 'There was a problem making your request',
				error: err.message
			};

			return res.status(404).json(message);
		});
	},

	update: function(req, res) {
		if(!req.body.email) {
			return res.status(400).json({
				message: 'There was a problem making your request',
				error: 'Email is missing'
			});
		}

		userService.editUser(req.params.userId, req.body.email).then(user => {
			return res.status(200).json({
				message: 'User successfully updated',
				data: {
					user
				}
			});
		}).catch(err => {
			return res.status(400).json({
				message: 'There was a problem making the request',
				error: err.message
			});
		});
	}
};

module.exports = userCtrl;
