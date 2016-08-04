const thinky = require('../config/db');
const type = thinky.type;


const Record = thinky.createModel('Record', {
	id: type.string(),
	vehicleId: type.string().required(),
	userId: type.string().required(),
	mileage: type.number(),
	mechanic: type.string(),
	description: type.string(),
	product: type.string(),
	amount: type.string(),
	date: type.date().default(new Date()),
	createdAt: type.date().default(new Date()),
	updatedAt: type.date().default(new Date())
});

Record.ensureIndex('createdAt');
Record.ensureIndex('vehicleId');

module.exports = Record;

// Relations
const Vehicle = require('./Vehicle');
Record.belongsTo(Vehicle, 'vehicle', 'vehicleId', 'id');
