const thinky = require('../config/db');
const type = thinky.type;


const Vehicle = thinky.createModel('Vehicle', {
	id: type.string(),
	userId: type.string().required(),
	make: type.string().required(),
	model: type.string().required(),
	year: type.number(),
	trim: type.string(),
	color: type.string(),
	createdAt: type.date().default(new Date()),
	updatedAt: type.date().default(new Date())
});

Vehicle.ensureIndex('createdAt');
Vehicle.ensureIndex('userId');

module.exports = Vehicle;

// Relations
const User = require('./User');
Vehicle.belongsTo(User, 'user', 'userId', 'id');

const Record = require('./Record');
Vehicle.hasMany(Record, 'records', 'id', 'vehicleId');

const Modification = require('./Modification');
Vehicle.hasMany(Modification, 'modifications', 'id', 'vehicleId');
