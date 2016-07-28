const thinky = require('../config/db');
const type = thinky.type;


const User = thinky.createModel('User', {
  id: type.string(),
  email: type.string().email().lowercase().required(),
  hash: type.string().required().length(60),
  tokens: {
    verify: type.string().uuid(4),
    reset: type.string().uuid(4),
  },
  admin: type.boolean().default(false),
  createdAt: type.date().default(new Date()),
  updatedAt: type.date().default(new Date())
});


User.define('isVerified', function() {
  return this.tokens.verify === null;
});

module.exports = User;

// Relations
let Vehicle = require('./Vehicle');
User.hasMany(Vehicle, 'vehicles', 'id', 'userId');
