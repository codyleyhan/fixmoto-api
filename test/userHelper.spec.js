const assert = require('chai').assert;
const models = require('../models');
const userHelper = require('../helpers/userHelper');


describe('User Helper Class', function() {
  before(function(done) {
    models.sequelize.sync({force: true}).then(function() {
      done();
    }
    );
  });

  it('should connect to postgres', function(done) {
    models.sequelize.authenticate().then(function() {
      done();
    });
  });

  it('should create a user', function(done) {
    userHelper.createUser('test@test.com', 'test').then(user => {
      done();
    }).catch(err => {
      console.log(err.errors[0].message);
    });
  });

  it('should get a user by ID', function(done) {
    userHelper.getUserById(1).then(user => {
      assert.equal(user.email, 'test@test.com');
      done();
    });
  });

  it('should delete a user', function(done) {
    userHelper.deleteUser(1).then(deleted => {
      assert.equal(deleted, true);
      done();
    });
  });
});
