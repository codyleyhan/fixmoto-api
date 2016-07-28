const thinky = require('../config/db');
const type = thinky.type;


const Modification = thinky.createModel('Modification', {
  id: type.string(),
  vehicleId: type.string().required(),
  description: type.string(),
  product: type.string(),
  date: type.date().default(new Date()),
  mechanic: type.string(),
  createdAt: type.date().default(new Date()),
  updatedAt: type.date().default(new Date())
});

Modification.ensureIndex("createdAt");

module.exports = Modification;

// Relations
const Vehicle = require('./Vehicle');
Modification.belongsTo(Vehicle, 'vehicle', 'vehicleId', 'id');
