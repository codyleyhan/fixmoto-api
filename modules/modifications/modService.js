const Modification = require('../../models/Modification');
const vehicleService = require('../vehicles/vehicleService');
const Promise = require('bluebird');
const r = require('../../config/db').r;
const _ = require('lodash');

const modService = {
	/**
	* Finds all modifications in the database
	* @param  {Int} limit  =             10 number of modifications to return
	* @param  {Int} offset =             0  number of limits to offset
	* @return {[Modification]}              promise resolves to array of modifications
	*/
	getAll: function(limit = 10, offset = 0) {
		return new Promise((resolve, reject) => {
			if(limit < 0 || offset < 0) {
				throw new Error('Limit and offset must be positive numbers');
			}

			const beginMod = (limit*offset);
			const endMod = beginMod + limit;

			Modification.orderBy({index: r.desc('createdAt')}).slice(beginMod, endMod).run().then(mods => {
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

	/**
	* Finds all modifications that are owned by a vehicleId
	* @param  {String} vehicleId         the vehicle id that owns the modifications
	* @return {[Modification]}           promise resolves to an array of modifications
	*/
	getAllByVehicleId: function({vehicleId, userId, admin}) {
		return new Promise((resolve, reject) => {

			vehicleService.getVehicle(vehicleId).then(vehicle => {
				if(vehicle.userId !== userId && !admin) {
					let err = new Error('You are not authorized');
					err.name = 'AuthorizationError';
					throw err;
				}

				return Modification.getAll(vehicleId, {index: 'vehicleId'}).orderBy(r.desc('createdAt')).run();
			}).then(mods => {

				return resolve(mods);

			}).catch(err => {

				if(err.name == 'DocumentNotFoundError') {
					err.message = `Unable to find vehicle with id of ${vehicleId}`;
				}

				return reject(err);

			});

		});
	},

	/**
	* Finds a modification by id in the DB
	* @param  {String} id the modification id
	* @return {Modification}    promise resolves to modification object
	*/
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

	/**
	* Adds a modification to the database
	* @param  {String} vehicleId     id of the vehicle that owns the mod
	* @param  {String} description   description of work done
	* @param  {String} product     	 product used in work
	* @param  {Date} date            date the work is done
	* @param  {String} mechanic      who did the work
	* @return {Modification}             promise resolves to Modification object
	*/
	addMod: function({ vehicleId, description, product, date, mechanic, userId, admin }) {
		return new Promise((resolve, reject) => {

			let mod = new Modification({
				vehicleId,
				description,
				product,
				date,
				userId,
				mechanic
			});

			vehicleService.getVehicle(vehicleId).then(vehicle => {

				if(vehicle.userId !== userId && !admin) {
					let err = new Error('You are not authorized');
					err.name = 'AuthorizationError';
					throw err;
				} else {
					return mod.save();
				}
			}).then(mod => {
				return resolve(mod);
			}).catch(err => {
				return reject(err);
			});
		});
	},

	/**
	* Edits a modification in the database
	* @param  {String} id                id of the modification
	* @param  {String} vehicleId         id of the vehicle that owns the mod
	* @param  {String} description       description of work done
	* @param  {String} product           product used in work
	* @param  {Date} date                date the work is done
	* @param  {String} mechanic          who did the work
	* @return {Modification}             promise resolves to modification object
	*/
	editMod: function({modId, description, product, date, mechanic, userId, admin }) {
		return new Promise((resolve, reject) => {

			let newMod = _.omitBy({
				description,
				product,
				date,
				mechanic,
				updatedAt: new Date()
			}, _.isNil);


			this.getMod(modId).then(mod => {
				if(mod.userId !== userId && !admin) {
					let err = new Error('You are not authorized');
					err.name = 'AuthorizationError';
					throw err;
				}

				return mod.merge(newMod).save();
			}).then(mod => {

				return resolve(mod);

			}).catch(err => {
				if(err.name == 'DocumentNotFoundError') {
					err.message = `Unable to find modification with id of ${modId}`;
				}

				reject(err);

			});
		});
	},

	/**
	* Deletes a modification from the database
	* @param  {String} id id of the modification
	* @return {Boolean}    promise resolves to true if deleted
	*/
	deleteMod: function({ modId, userId, admin }) {
		return new Promise((resolve, reject) => {

			this.getMod(modId).then(mod => {

				if(mod.userId !== userId && !admin) {
					let err = new Error('You are not authorized');
					err.name = 'AuthorizationError';
					throw err;
				}

				return mod.delete();
			}).then(() => {
				return resolve(true);
			}).catch(err => {

				if(err.name == 'DocumentNotFoundError') {
					err.message = `Unable to find modification with id of ${modId}`;
				}

				return reject(err);

			});

		});
	}
};

module.exports = modService;
