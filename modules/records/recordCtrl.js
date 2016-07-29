const recordService = require('./recordService');

const recordCtrl = {
  index: function(req, res) {
    if(req.query.vehicleId) {
      const id = req.query.vehicleId;
      recordService.getAllByVehicleId(id).then(records => {
        const message = {
          data: {
            records
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

      recordService.getAll(limit, offset).then(result => {
        const message = {
          meta: {
            limit,
            offset,
            count: result.count
          },
          data: {
            records: result.records
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
    const id = req.params.recordId;

    recordService.getRecord(id).then(record => {
      const message = {
        data: {
          record
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
    recordService.addRecord(req.body).then(record => {
      const message = {
        data: {
          record
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
    recordService.editRecord(req.params.recordId, req.body).then(record => {
      const message = {
        data: {
          record
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
    recordService.deleteRecord(req.params.recordId).then(result => {
      if(result === true) {
        const message = {
          message: `The recordwith id of ${req.params.recordId} has been deleted`
        };

        return res.status(200).json(message);
      }
    }).catch(err => {
      const message = {
        message: 'There was a problem making your request',
        error: err.name
      };

      return res.status(404).json(message);
    });
  }
};

module.exports = recordCtrl;
