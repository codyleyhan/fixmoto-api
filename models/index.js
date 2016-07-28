//imports all models and exports them as a single object
const models = {
  User: require('./User'),
  Vehicle: require('./Vehicle'),
  Record: require('./Record'),
  Modification: require('./Modification'),
  Maintenance: require('./Maintenance')
};

module.exports = models;
