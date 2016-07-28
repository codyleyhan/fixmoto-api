const User = require('../../models/User');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userService = {
  getAll: function(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      User.limit(limit).skip(offset*limit).run().then(users => {
        return resolve(users);
      }).error(err => {
        return reject(err);
      })
    });
  },

  getUser: function(id) {
    return new Promise((resolve, reject) => {
      User.get(id).run().then(user => {
        return resolve(user);
      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find user with id of ${id}`;
        }
        return reject(err);
      });
    });
  },

  addUser: function({ email, password }) {
    return new Promise((resolve, reject) => {
      this.hashPass(password).then(hash => {

        let user = new User({
          email: email,
          hash: hash,
          tokens: {
            verify: uuid.v4()
          }
        });

        user.save().then(doc => {
          return resolve(doc);
        }).error(err => {
          return reject(err);
        });
      });
    });
  },

  hashPass: function(password) {
    return new Promise((resolve, reject) => {
      const saltRounds = 8;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
          return reject(err);
        }

        return resolve(hash);
      });
    });
  },

  comparePass: function(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, res) => {
        if(err) {
          return reject(err);
        }

        return resolve(res);
      });
    });
  },

  checkAndUpdatePass: function({ currentPass, newPass, hash }) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(currentPass, hash, (err, res) => {
        if(err) {
          return reject(err);
        } else if(res === false) {
          throw new Error('Unable to update password, unable to find user or incorrect password');
          return reject(err);
        }

        // If correct password is given, hash new pass
        this.hashPass(newPass).then(hash => {
          return resolve(hash);
        }).catch(err => {
          return reject(err);
        });

      });
    });
  },

  editUser: function(id, email) {
    return new Promise((resolve, reject) => {
      User.get(id).run().then(user => {
        user.email = email;
        user.updatedAt = new Date();
        user.save().then((user) => {
          return resolve(user);
        }).error(err => {
          return reject(err);
        });
      }).error(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find user with id of ${id}`;
        }
        return reject(err);
      });
    });
  },

  deleteUser: function(id) {
    return new Promise((resolve, reject) => {
      User.get(id).run().then(user => {
        user.purge().then(user => {
          return resolve(true);
        });
      }).error(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find user with id of ${id}`;
        }
        return reject(err);
      });
    });
  }
}

module.exports = userService;
