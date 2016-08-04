const errorHandler = function(req, res, err, status = 400) {
	if(err.name === 'AuthorizationError') {
		return res.status(403).json({
			message: 'You are not authorized',
			error: 'AuthorizationError'
		});
	} else {
		return res.status(status).json({
			message: 'There was a problem making the request',
			error: err.message
		});
	}
};

module.exports = errorHandler;
