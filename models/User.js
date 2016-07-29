const thinky = require('../config/db');
const type = thinky.type;
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

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

User.ensureIndex("createdAt");

User.define('isVerified', function() {
  return this.tokens.verify === null;
});

User.define('createToken', function(platform) {

  return new Promise((resolve, reject) => {
    const today = new Date();
    let exp = new Date(today);

    let days = 30;

    if(platform === 'mobile') {
      days = 10000;
    }

    exp.setDate(today.getDate() + days);

    const expInt = parseInt(exp.getTime() / 1000);

    const payload = {
      id: this.id,
      email: this.email,
      admin: this.admin,
      exp: expInt
    };

    jwt.sign(payload, process.env.APP_SECRET, (err, token) => {
      if(err) {
        return reject(err);
      } else {
        return resolve(token);
      }
    });
  });
});

module.exports = User;

// Relations
let Vehicle = require('./Vehicle');
User.hasMany(Vehicle, 'vehicles', 'id', 'userId');
