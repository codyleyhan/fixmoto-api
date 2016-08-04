const jwt = require('jsonwebtoken');
const Promise = require('bluebird');


const authService = {
	createToken: function({id, email, admin}, platform) {
		return new Promise((resolve, reject) => {
			const today = new Date();
			let exp = new Date(today);

			let days = 30;

			if(platform === 'mobile') {
				days = 10000;
			}

			exp.setDate(today.getDate() + days);

			const expInt = parseInt(exp.getTime() / 1000);

			const payload = {
				id,
				email,
				admin,
				exp: expInt
			};

			jwt.sign(payload, process.env.APP_SECRET, {}, function(err, token) {
				if(err) {
					return reject(err);
				}

				return resolve(token);
			});

		});
	}
};

module.exports = authService;
