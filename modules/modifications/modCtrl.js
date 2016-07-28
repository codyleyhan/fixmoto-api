const modService = require('./modService');

const modCtrl = {
  index: function(req, res) {
    if(req.query.vehicleId) {
      const id = req.query.vehicleId;
      modService.getAllByVehicleId(id).then(vehicles => {
        const message = {
          data: {
            vehicles
          }
        };

        return res.json(message);
      }).catch(err => {
        return res.status(400).json({
          message: 'There was a problem making the request',
          error: err.message
        });
      });
    } else {

      const limit = parseInt(req.query.limit) || parseInt(req.body.limit) || 10;
      const offset = parseInt(req.query.offset) || parseInt(req.body.offset) || 0;

      modService.getAll(limit, offset).then(result => {
        const message = {
          meta: {
            limit,
            offset,
            count: result.count
          },
          data: {
            modifications: result.mods
          }
        };

        return res.json(message);
      }).catch(err => {
        return res.status(400).json({
          message: 'There was a problem making the request',
          error: err.message
        });
      });
    }
  },

  show: function(req, res) {
    const id = req.params.modId;

    modService.getMod(id).then(modification => {
      const message = {
        data: {
          modification
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
  },

  create: function(req, res) {
    modService.addMod(req.body).then(modification => {
      const message = {
        data: {
          modification
        }
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
    modService.editMod(req.params.modId, req.body).then(modification => {
      const message = {
        data: {
          modification
        }
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
    modService.deleteMod(req.params.modId).then(result => {
      if(result === true) {
        const message = {
          message: `The modification with id of ${req.params.modId} has been deleted`
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

module.exports = modCtrl;
