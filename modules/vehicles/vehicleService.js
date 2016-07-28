const Vehicle = require('../../models/Vehicle');
const Promise = require('bluebird');
const r = require('../../config/db').r;
const _ = require('lodash');


const vehicleService = {

  getAll: function(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      Vehicle.orderBy({index: r.desc('createdAt')}).skip(offset*limit)
      .limit(limit).run().then(vehicles => {
        return resolve(vehicles);
      }).catch(err => {
        return resolve(err);
      });
    });
  },


  getAllByUserId: function(userId) {
    return new Promise((resolve, reject) => {
      Vehicle.getAll(userId, {index: 'userId'}).orderBy(r.desc('createdAt'))
      .run().then(vehicles => {
        return resolve(vehicles);
      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find vehicle with id of ${id}`;
        }

        return reject(err);
      })
    });
  },


  getVehicle: function(id) {
    return new Promise((resolve, reject) => {
      Vehicle.get(id).run().then(vehicle => {
        return resolve(vehicle);
      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find vehicle with id of ${id}`;
        }
        return reject(err);
      });
    });
  },

  getVehicleFull: function(id) {
    return new Promise((resolve, reject) => {
      Vehicle.get(id).getJoin({
        records: {
          maintenance: true
        },
        modifications: true
      }).run().then(vehicle => {
        return resolve(vehicle);
      }).catch(err => {
        return reject(err);
      });
    });
  },

  addVehicle: function({ userId, make, model, year, trim, color }) {
    return new Promise((resolve, reject) => {
      let vehicle = new Vehicle({
        userId,
        make,
        model,
        year,
        trim,
        color
      });

      vehicle.save().then(vehicle => {
        return resolve(vehicle);
      }).catch(err => {
        return reject(err);
      });
    });
  },


  editVehicle: function(id, { make, model, year, trim, color }) {
    return new Promise((resolve, reject) => {
      let newVehicle = _.omitBy({
        make,
        model,
        year,
        trim,
        color,
        updatedAt: new Date()
      }, _.isNil);

      this.getVehicle(id).then(vehicle => {
        vehicle.merge(newVehicle).save().then(vehicle => {
          return resolve(vehicle);
        });
      }).catch(err => {
        reject(err);
      })
    });
  },


  deleteVehicle: function(id) {
    return new Promise((resolve, reject) => {
      Vehicle.get(id).run().then(vehicle => {
        vehicle.purge().then(vehicle => {
          return resolve(true);
        });
      }).error(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find vehicle with id of ${id}`;
        }
        return reject(err);
      });
    });
  }

};

module.exports = vehicleService;
