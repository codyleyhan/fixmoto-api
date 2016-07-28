const thinky = require('../config/db');
const type = thinky.type;


const Maintenance = thinky.createModel('Maintenance', {
  id: type.string().required(),
  recordId: type.string().required(),
  work: type.string(),
  product: type.string(),
  amount: type.string(),
  createdAt: type.date().default(new Date()),
  updatedAt: type.date().default(new Date())
});

module.exports = Maintenance;


// Relations
const Record = require('./Record');
Maintenance.belongsTo(Record, 'record', 'recordId', 'id');
