const thinky = require('../config/db');
const type = thinky.type;


const Vehicle = thinky.createModel('Vehicle', {
  id: type.string().required(),
  userId: type.string().required(),
  make: type.string(),
  model: type.string(),
  year: type.number(),
  trim: type.string(),
  color: type.string(),
  createdAt: type.date().default(new Date()),
  updatedAt: type.date().default(new Date())
});

module.exports = Vehicle;

// Relations
const User = require('./User');
Vehicle.belongsTo(User, 'user', 'userId', 'id');

const Record = require('./Record');
Vehicle.hasMany(Record, 'records', 'id', 'vehicleId');

const Modification = require('./Modification');
Vehicle.hasMany(Modification, 'modifications', 'id', 'vehicleId');
