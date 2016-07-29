const User = require('../../models/User');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const r = require('../../config/db').r;

const userService = {
  /**
   * finds all users in the db
   * @param  {String} limit  =          10 limits the number of users returned
   * @param  {Int} offset =             0  the offset of the pagination
   * @return {[Users]}                     returns a promise when resolved returns an array of users
   */
  getAll: function(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      if(limit < 0 || offset < 0) {
        throw new Error('Limit and offset must be positive numbers');
      }

      User.limit(limit).skip(offset*limit).run().then(users => {
        r.table('User').count().then(count => {
          return resolve({
            users,
            count
          });
        });

      }).error(err => {
        return reject(err);
      })
    });
  },

  /**
   * Finds a user by id from the DB
   * @param  {String} id  the id of the user
   * @return {User}       returns a promise that resolves to a user object
   */
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

  /**
   * Creates and stores a user in the database
   * @param  {String} {        email        email of the user
   * @param  {String} password }            password of the user
   * @return {User}                         returns a promise that resolves
   *                                        to a user object
   */
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

        return user.save();
      }).then(user => {
        return resolve(user);
      }).catch(err => {
        return reject(err);
      });
    });
  },

  /**
   * Encrypts a plain password to a bcrypt encrypted hashPass
   * @param  {String} password the users password
   * @return {String}          returns a promise that resolves to a hash
   */
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

  /**
   * Compares a hash to a plain text password
   * @param  {String} password plain text password submitted by user
   * @param  {String} hash     the hash stored in the db
   * @return {Boolean}          returns a promise that resolves to true if valid
   */
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

  /**
   * Checks if password matches hash then hashes new password
   * @param  {String} {       currentPass   current password the user submitted
   * @param  {String} newPass               new password to be encrypted
   * @param  {String} hash    }             hash stored in the DB
   * @return {String}         promise that resolves to a hash
   */
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

  /**
   * Updates a user in the database
   * @param  {String} id    user id
   * @param  {String} email new email
   * @return {User}       promise that resolves to user object
   */
  editUser: function(id, email) {
    return new Promise((resolve, reject) => {
      User.get(id).run().then(user => {
        user.email = email;
        user.updatedAt = new Date();
        return user.save();
      }).then((user) => {
        return resolve(user);
      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find user with id of ${id}`;
        }
        return reject(err);
      });
    });
  },

  /**
   * Deletes a user from the DB
   * @param  {String} id user id to be deleted
   * @return {Boolean}    promise resolves to true if user deleted
   */
  deleteUser: function(id) {
    return new Promise((resolve, reject) => {
      const joins = {
        vehicles: {
          records: true,
          modifications: true
        }
      };

      User.get(id).getJoin(joins).run().then(user => {
        return user.deleteAll();
      }).then(user => {
        return resolve(true);
      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find user with id of ${id}`;
        }
        return reject(err);
      });
    });
  }
}

module.exports = userService;
