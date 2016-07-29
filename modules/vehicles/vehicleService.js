const Vehicle = require('../../models/Vehicle');
const Promise = require('bluebird');
const r = require('../../config/db').r;
const _ = require('lodash');


const vehicleService = {
  /**
   * Finds all vehicles in the database with a cursor
   * @param  {Int} limit  =             10 the number of vehicles to return
   * @param  {Int} offset =             0  the number of pages to skip
   * @return {[Vehicles]}        returns an array of vehicle objects
   */
  getAll: function(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      if(limit < 0 || offset < 0) {
        throw new Error('Limit and offset must be positive numbers');
      }

      const beginVehicle = (limit*offset);
      const endVehicle = beginVehicle + limit;

      Vehicle.orderBy({index: r.desc('createdAt')}).slice(beginVehicle, endVehicle)
      .run().then(vehicles => {
        r.table('Vehicle').count().then(count => {
          return resolve({
            vehicles,
            count
          });
        });

      }).catch(err => {

        return reject(err);

      });

    });
  },

  /**
   * Finds all vehicle in a database that are owned by a userId
   * @param  {String} userId     the user id of the vehicles to find
   * @return {[vehicles]}        returns an array of vehicle objects
   */
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

      });

    });
  },

  /**
   * Finds a vehicle by id
   * @param  {String} id  id of the vehicle to be returned
   * @return {Vehicle}    returns a vehicle object
   */
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

  /**
   * Finds vehicle in the DB including all joins
   * @param  {String} id  id of the vehicle to be returned
   * @return {vehicle}    Vehicle object with all joins
   */
  getVehicleFull: function(id) {
    return new Promise((resolve, reject) => {

      // DB joins to be done
      const joins = {
        records: true,
        modifications: true
      };

      Vehicle.get(id).getJoin(joins).run().then(vehicle => {

        return resolve(vehicle);

      }).catch(err => {

        return reject(err);

      });

    });
  },

  /**
   * Adds a vehicle to the DB
   * @param  {String} userId    the id of the user that owns vehicle
   * @param  {String} make      make of the vehicle
   * @param  {String} model     model of the vehicle
   * @param  {Int}    year      year the vehicle was made
   * @param  {String} trim      trim package on the vehicle
   * @param  {String} color     color of the vehicle
   * @return {Vehicle}       returns the created vehicle object
   */
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

  /**
   * Updates a vehicle in the DB
   * @param  {String} id        vehicle id
   * @param  {String} make      make of the vehicle
   * @param  {String} model     model of the vehicle
   * @param  {Int}    year      year the vehicle was made
   * @param  {String} trim      trim package on the vehicle
   * @param  {String} color     color of the vehicle
   * @return {vehicle}          returns an updated vehicle object
   */
  editVehicle: function(id, { make, model, year, trim, color }) {
    return new Promise((resolve, reject) => {

      //removes all null values from the user input
      let newVehicle = _.omitBy({
        make,
        model,
        year,
        trim,
        color,
        updatedAt: new Date()
      }, _.isNil);

      this.getVehicle(id).then(vehicle => {

        return vehicle.merge(newVehicle).save();

      }).then(vehicle => {

        return resolve(vehicle);

      }).catch(err => {

        return reject(err);

      });

    });
  },

  /**
   * Deletes the vehicle in the DB
   * @param  {String} id  the vehicle id to be deleted
   * @return {boolean}    returns true if successfully deletes vehicle
   */
  deleteVehicle: function(id) {
    return new Promise((resolve, reject) => {

      const joins = {
        records: true,
        modifications: true
      };

      Vehicle.get(id).getJoin(joins).run().then(vehicle => {
        return vehicle.deleteAll();

      }).then(vehicle => {

        return resolve(true);

      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find vehicle with id of ${id}`;
        }

        return reject(err);

      });

    });
  }
};

module.exports = vehicleService;
