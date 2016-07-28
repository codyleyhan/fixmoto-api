const assert = require('chai').assert;
const thinky = require('../../config/db');
const userService = require('../../modules/users/userService');

describe('userService', function() {
  before(function(done) {
    thinky.dbReady().then(function() {
      return done();
    });
  });

  describe('Encrypting passwords ', function() {
    const pass = 'test';
    let hash;
    const nonPass = 'nottest';


    it('should hash a password', function(done) {
      userService.hashPass(pass).then(hashedPass => {
        hash = hashedPass;
        assert.lengthOf(hash, 60);
        done();
      });
    });

    it('should recoginize a correct password', function(done) {
      userService.comparePass(pass, hash).then(res => {
        assert.equal(res, true);
        done();
      });
    });

    it('should recognize a wrong password', function(done) {
      userService.comparePass(nonPass, hash).then(res => {
        assert.equal(res, false);
        done();
      });
    })
  });

  describe('#addUser()', function() {
    it('should create a user', function(done) {
      const email = 'test@test.com';
      userService.addUser({
        email: email,
        password: 'test'
      }).then(user => {
        assert.equal(user.email, email);
        assert.property(user.tokens, 'verify');
        assert.property(user, 'hash');
        done();
      });
    });
  });

});
