const recordService = require('./recordService');
const errorHandler = require('../errorHandler');

const recordCtrl = {
	index: function(req, res) {
		if (req.query.vehicleId || req.body.vehicleId) {

			if (!req.body.vehicleId) {
				req.body.vehicleId = req.query.vehicleId;
			}


			recordService.getAllByVehicleId(req.body).then(records => {

				const message = {
					data: {
						records
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

			recordService.getAll(limit, offset).then(result => {
				const message = {
					meta: {
						limit,
						offset,
						count: result.count
					},
					data: {
						records: result.records
					}
				};

				return res.json(message);
			}).catch(err => {
				return errorHandler(req, res, err);
			});
		}
	},

	show: function(req, res) {
		const id = req.params.recordId;

		recordService.getRecord(id).then(record => {
			if(record.userId !== req.user.id && !req.user.admin) {
				let err = new Error('You are not authorized');
				err.name = 'AuthorizationError';
				throw err;
			}

			const message = {
				data: {
					record
				}
			};

			return res.json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	create: function(req, res) {
		recordService.addRecord(req.body).then(record => {
			const message = {
				data: {
					record
				}
			};

			return res.status(201).json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	update: function(req, res) {
		req.body.recordId = req.params.recordId;

		recordService.editRecord(req.body).then(record => {
			const message = {
				data: {
					record
				}
			};
			return res.status(200).json(message);
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	},

	delete: function(req, res) {
		req.body.recordId = req.params.recordId;

		recordService.deleteRecord(req.body).then(result => {
			if(result === true) {
				const message = {
					message: `The record with id of ${req.params.recordId} has been deleted`
				};

				return res.status(200).json(message);
			}
		}).catch(err => {
			return errorHandler(req, res, err, 400);
		});
	}
};

module.exports = recordCtrl;
