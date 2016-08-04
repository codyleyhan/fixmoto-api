const modService = require('./modService');
const errorHandler = require('../errorHandler');

const modCtrl = {
	index: function(req, res) {
		if(req.query.vehicleId || req.body.vehicleId) {
			if(!req.body.vehicleId) {
				req.body.vehicleId = req.query.vehicleId;
			}

			modService.getAllByVehicleId(req.body).then(modifications => {

				const message = {
					data: {
						modifications
					}
				};

				return res.json(message);

			}).catch(err => {
				return errorHandler(req, res, err, 400);
			});
		} else {

			if(!req.user.admin) {
				return res.status(403).json({
					message: 'You are not authorized',
					error: 'AuthorizationError'
				});
			}

			const limit = parseInt(req.query.limit) || parseInt(req.body.limit) || 10;
			const offset = parseInt(req.query.offset) || parseInt(req.body.offset) || 0;

			modService.getAll(limit, offset).then(result => {
				const message = {
					meta: {
						limit,
						offset,
						count: result.count
					},
					data: {
						modifications: result.mods
					}
				};

				return res.json(message);
			}).catch(err => {
				return errorHandler(req, res, err, 400);
			});
		}
	},

	show: function(req, res) {
		const id = req.params.modId;

		modService.getMod(id).then(modification => {
			if(modification.userId !== req.user.id && !req.user.admin) {
				return res.status(403).json({
					message: 'You are not authorized',
					error: 'AuthorizationError'
				});
			}

			const message = {
				data: {
					modification
				}
			};

			return res.json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	create: function(req, res) {
		if(!req.body.vehicleId) {
			return res.status(400).json({
				message: 'Missing vehicle id.',
				error: 'missing data'
			});
		}

		modService.addMod(req.body).then(modification => {
			const message = {
				data: {
					modification
				}
			};
			return res.status(201).json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	update: function(req, res) {
		req.body.modId = req.params.modId;

		modService.editMod(req.body).then(modification => {
			const message = {
				data: {
					modification
				}
			};
			return res.status(200).json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	delete: function(req, res) {
		req.body.modId = req.params.modId;

		modService.deleteMod(req.body).then(result => {
			if(result === true) {
				const message = {
					message: `The modification with id of ${req.params.modId} has been deleted`
				};

				return res.status(200).json(message);
			}
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	}
};

module.exports = modCtrl;
