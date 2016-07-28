const vehicleService = require('./vehicleService');

const vehicleCtrl = {
  index: function(req, res) {
    if(req.query.userId) {
      vehicleService.getAllByUserId(req.query.userId).then(vehicles => {
        const message = {
          data: {
            vehicles
          }
        };

        return res.json(message);
      }).catch(err => {
        return res.json({
          message: 'There was a problem making the request',
          error: err.message
        });
      });
    } else {
      const limit = parseInt(req.query.limit) || parseInt(req.body.limit) || 10;
      const offset = parseInt(req.query.offset) || parseInt(req.body.offset) || 0;

      vehicleService.getAll(limit, offset).then(vehicles => {
        const message = {
          meta: {
            limit,
            offset
          },
          data: {
            vehicles
          }
        };

        return res.json(message);
      }).catch(err => {
        return res.json({
          message: 'There was a problem making the request',
          error: err.message
        });
      });
    }
  },


  show: function(req, res) {
    const id = req.params.vehicleId || req.body.vehicleId;

    if(req.query.full == "true") {
      vehicleService.getVehicleFull(id).then(vehicle => {
        const message = {
          data: {
            vehicle
          }
        };

        return res.json(message);
      }).catch(err => {
        const message = {
          message: 'There was a problem making your request',
          error: err.message
        };

        return res.status(400).json(message);
      });
    } else {
      vehicleService.getVehicle(id).then(vehicle => {
        const message = {
          data: {
            vehicle
          }
        };

        return res.json(message);
      }).catch(err => {
        const message = {
          message: 'There was a problem making your request',
          error: err.message
        };

        return res.status(400).json(message);
      });
    }

  },

  create: function(req, res) {
    vehicleService.addVehicle(req.body).then(vehicle => {
      const message = {
        data: vehicle
      };
      return res.status(201).json(message);
    }).catch(err => {
      const message = {
        message: 'There was a problem making the request',
        error: err.message
      };

      return res.status(400).json(message);
    });
  },

  update: function(req, res) {
    vehicleService.editVehicle(req.params.vehicleId, req.body).then(vehicle => {
      const message = {
        data: vehicle
      };
      return res.status(200).json(message);
    }).catch(err => {
      return res.status(400).json({
        message: 'There was a problem making the request',
        error: err.message
      });
    });
  },

  delete: function(req, res) {
    vehicleService.deleteVehicle(req.params.vehicleId).then(result => {
      if(result === true) {
        const message = {
          message: `The vehicle with id of ${req.params.vehicleId} has been deleted`
        };

        return res.status(200).json(message);
      }
    }).catch(err => {
      const message = {
        message: 'There was a problem making your request',
        error: err.message
      };

      return res.status(404).json(message);
    });
  }
};

module.exports = vehicleCtrl;
