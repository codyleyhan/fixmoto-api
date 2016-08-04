const vehicleService = require('./vehicleService');
const errorHandler = require('../errorHandler');

const vehicleCtrl = {
	index: function(req, res) {
		if(req.query.userId) {

			if(req.query.userId !== req.user.id && !req.user.admin) {
				return res.status(403).json({
					message: 'You are not authorized',
					error: 'AuthorizationError'
				});
			}

			vehicleService.getAllByUserId(req.query.userId).then(vehicles => {
				const message = {
					data: {
						vehicles
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

			vehicleService.getAll(limit, offset).then(result => {
				const message = {
					meta: {
						limit,
						offset,
						count: result.count
					},
					data: {
						vehicles: result.vehicles
					}
				};

				return res.json(message);
			}).catch(err => {
				return errorHandler(req, res, err, 400);
			});
		}
	},


	show: function(req, res) {
		const id = req.params.vehicleId || req.body.vehicleId;

		if(req.query.full == 'true') {
			vehicleService.getVehicleFull(id).then(vehicle => {
				if(vehicle.userId !== req.user.id && !req.user.admin) {
					let err = new Error('You are not authorized');
					err.name = 'AuthorizationError';
					throw err;
				}

				const message = {
					data: {
						vehicle
					}
				};

				return res.json(message);
			}).catch(err => {
				return errorHandler(req, res, err, 400);
			});
		} else {
			vehicleService.getVehicle(id).then(vehicle => {

				if(vehicle.userId !== req.user.id && !req.user.admin) {
					let err = new Error('You are not authorized');
					err.name = 'AuthorizationError';
					throw err;
				}

				const message = {
					data: {
						vehicle
					}
				};

				return res.json(message);
			}).catch(err => {
				return errorHandler(req, res, err, 400);
			});
		}

	},

	create: function(req, res) {

		vehicleService.addVehicle(req.body).then(vehicle => {
			const message = {
				data: {
					vehicle
				}
			};
			return res.status(201).json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	update: function(req, res) {
		req.body.vehicleId = req.params.vehicleId;

		vehicleService.editVehicle(req.body).then(vehicle => {

			const message = {
				data: {
					vehicle
				}
			};
			return res.status(200).json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	delete: function(req, res) {
		const request = {
			vehicleId: req.params.vehicleId,
			admin : req.user.admin,
			userId: req.user.id
		};

		vehicleService.deleteVehicle(request).then(result => {
			if(result === true) {
				const message = {
					message: `The vehicle with id of ${req.params.vehicleId} has been deleted`
				};

				return res.status(200).json(message);
			}
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	}
};

module.exports = vehicleCtrl;
