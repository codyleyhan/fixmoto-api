const Record = require('../../models/Record');
const Promise = require('bluebird');
const r = require('../../config/db').r;
const _ = require('lodash');

const recordService = {
  /**
   * Finds all records in the database
   * @param  {Int} limit  =             10 number of records to return
   * @param  {Int} offset =             0  number of limits to offset
   * @return {[Record]}                    promise resolves to array of records
   */
  getAll: function(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      if(limit < 0 || offset < 0) {
        throw new Error('Limit and offset must be positive numbers');
      }

      const beginRecord= (limit*offset);
      const endRecord = beginRecord+ limit;

      Record.orderBy({index: r.desc('createdAt')}).slice(beginRecord, endRecord)
        .run().then(records => {
          r.table('Record').count().then(count => {
            return resolve({
              records,
              count
            });
          });

      }).catch(err => {

        return reject(err);

      });
    });
  },

  /**
   * Finds all records that are owned by a vehicleId
   * @param  {String} vehicleId   the vehicle id that owns the records
   * @return {[Record]}           promise resolves to an array of records
   */
  getAllByVehicleId: function(vehicleId) {
    return new Promise((resolve, reject) => {

      Record.getAll(vehicleId, {index: 'vehicleId'}).orderBy(r.desc('createdAt'))
        .run().then(records => {

        return resolve(records);

      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find vehicle with id of ${vehicleId}`;
        }

        return reject(err);

      });

    });
  },

  /**
   * Finds a record by id in the DB
   * @param  {String} id the record id
   * @return {Record}    promise resolves to record object
   */
  getRecord: function(id) {
    return new Promise((resolve, reject) => {

      Record.get(id).run().then(record => {

        return resolve(record);

      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find record with id of ${id}`;
        }

        return reject(err);

      });

    });
  },

  /**
   * Adds a record to the DB
   * @param  {String} { vehicleId         vehicle that owns the record
   * @param  {String}   mileage           mileage of the record
   * @param  {Date}     date              date the work was performed
   * @param  {String}   mechanic          mechanic that did the work
   * @param  {String}   description       description of the work done
   * @param  {String}   product           product used for the record
   * @param  {String}   amount      }     amount used in the work
   * @return {Record}             promise resolves to Record object
   */
  addRecord: function({ vehicleId, mileage, date, mechanic, description, product, amount }) {
    return new Promise((resolve, reject) => {

      let record = new Record({
        vehicleId,
        mileage,
        date,
        mechanic,
        description,
        product,
        amount
      });

      record.save().then(record => {
        return resolve(record);
      }).catch(err => {
        return reject(err);
      });

    });
  },

  /**
   * Edits a record in the database
   * @param  {String}   id                id of the record
   * @param  {String}   mileage           mileage of the record
   * @param  {Date}     date              date the work was performed
   * @param  {String}   mechanic          mechanic that did the work
   * @param  {String}   description       description of the work done
   * @param  {String}   product           product used for the record
   * @param  {String}   amount      }     amount used in the work
   * @return {Record}             promise resolves to record object
   */
  editRecord: function(id,{ mileage, date, mechanic, description, product, amount } ) {
    return new Promise((resolve, reject) => {

      let newRecord = _.omitBy({
        mileage,
        date,
        mechanic,
        description,
        product,
        amount,
        updatedAt: new Date()
      }, _.isNil);


      this.getRecord(id).then(record => {
        return record.merge(newRecord).save();
      }).then(record => {

        return resolve(record);

      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find record with id of ${id}`;
        }

        reject(err);

      });
    });
  },

  /**
   * Deletes a record from the database
   * @param  {String} id id of the record
   * @return {Boolean}    promise resolves to true if deleted
   */
  deleteRecord: function(id) {
    return new Promise((resolve, reject) => {

      this.getRecord(id).then(record => {
        return record.delete();
      }).then(result => {
        return resolve(true);
      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find record with id of ${id}`;
        }

        return reject(err);

      });
    });
  }
};

module.exports = recordService;
