const thinky = require('../config/db');
const type = thinky.type;


const Record = thinky.createModel('Record', {
  id: type.string().required(),
  vehicleId: type.string().required(),
  mileage: type.number(),
  mechanic: type.string(),
  date: type.date().default(new Date()),
  createdAt: type.date().default(new Date()),
  updatedAt: type.date().default(new Date())
});

module.exports = Record;

// Relations
const Vehicle = require('./Vehicle');
Record.belongsTo(Vehicle, 'vehicle', 'vehicleId', 'id');

const Maintenance = require('./Maintenance');
Record.hasMany(Maintenance, 'maintenance', 'id', 'recordId');
