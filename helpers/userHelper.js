const models = require('../models');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const uuid = require('uuid');


class userHelper {
  /**
   * [getUsers Queries the User table and returns all users]
   * @param  Integer limit  =             10 number of users wanted
   * @param  Integer offset =             0  cursor offset
   * @return Promise        returns user array
   */
  static getUsers(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      models.User.findAll({
        limit: limit,
        offset: offset
      }).then((users) => {
        resolve(users);
      });
    });
  }

  /**
   * [getUserById Queries the User table for a single user]
   * @param  Integer userId The id of the user
   * @return Promise        returns a single user object
   */
  static getUserById(userId) {
    return new Promise((resolve, reject) => {
      models.User.findOne({
        where: {
          id: userId
        }
      }).then((user) => {
        return resolve(user.dataValues);
      }).catch(err => {
        return reject(err);
      });
    });
  }

  /**
   * [createUser creates a User and inserts the User into DB]
   * @param  String email      user email
   * @param  String password   user password
   * @return Promise           returns the User created
   */
  static createUser(email, password) {
    return new Promise((resolve, reject) => {
      const saltRounds = 5;
      let cleanedEmail = email.toString().toLowerCase();

      bcrypt.hashAsync(password, saltRounds).then(hash => {
        models.User.create({
          email: cleanedEmail,
          hash: hash,
          verifyToken: uuid.v4()
        }).then(user => {
          return resolve(user.dataValues);
        }).catch(err => {
          return reject(err);
        })
      }).catch(err => {
        return reject(err);
      });
    });
  }

  /**
   * [deleteUser Finds and deletes the user by id]
   * @param  {Integer} userId Id of user to be deleted
   * @return {Promise}        returns true if deleted
   */
  static deleteUser(userId) {
    return new Promise((resolve, reject) => {
      models.User.destroy({
        where: {
          id: userId
        }
      }).then(() => {
        return resolve(true);
      }).catch(err => {
        return reject(err);
      })
    });
  }
}


module.exports = userHelper;
