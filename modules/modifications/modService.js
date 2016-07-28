const Modification = require('../../models/Modification');
const Promise = require('bluebird');
const r = require('../../config/db').r;
const _ = require('lodash');

const modService = {

  getAll: function(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      if(limit < 0 || offset < 0) {
        throw new Error('Limit and offset must be positive numbers');
      }

      const beginMod = (limit*offset);
      const endMod = beginMod + limit;

      Modification.orderBy({index: r.desc('createdAt')}).slice(beginMod, endMod)
        .run().then(mods => {
          r.table('Modification').count().then(count => {
            return resolve({
              mods,
              count
            });
          });

      }).catch(err => {

        return reject(err);

      });
    });
  },


  getAllByVehicleId: function(vehicleId) {
    return new Promise((resolve, reject) => {

      Modification.getAll(vehicleId, {index: 'vehicleId'}).orderBy(r.desc('createdAt'))
        .run().then(mods => {

        return resolve(mods);

      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find modifications with id of ${vehicleId}`;
        }

        return reject(err);

      });

    });
  },


  getMod: function(id) {
    return new Promise((resolve, reject) => {

      Modification.get(id).run().then(mod => {

        return resolve(mod);

      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find modification with id of ${id}`;
        }

        return reject(err);

      });

    });
  },


  addMod: function({ vehicleId, description, product, date, mechanic }) {
    return new Promise((resolve, reject) => {

      let mod = new Modification({
        vehicleId,
        description,
        product,
        date,
        mechanic
      });

      mod.save().then(mod => {
        return resolve(mod);
      }).catch(err => {
        return reject(err);
      });

    });
  },


  editMod: function(id,{ description, product, date, mechanic } ) {
    return new Promise((resolve, reject) => {

      let newMod = _.omitBy({
        description,
        product,
        date,
        mechanic,
        updatedAt: new Date()
      }, _.isNil);


      this.getMod(id).then(mod => {

        mod.merge(newMod).save().then(mod => {

          return resolve(mod);

        });

      }).catch(err => {
        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find modification with id of ${id}`;
        }

        reject(err);

      });
    });
  },


  deleteMod: function(id) {
    return new Promise((resolve, reject) => {

      this.getMod(id).then(mod => {
        mod.delete().then(result => {
          return resolve(true);
        });
      }).catch(err => {

        if(err.name == 'DocumentNotFoundError') {
          err.message = `Unable to find modification with id of ${id}`;
        }

        return reject(err);

      });

    });
  }
};

module.exports = modService;
