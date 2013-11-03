var passport = require('passport'),
	utils = {};

utils.authAdminUser = function (request, response, next, callbacks) {
	
	passport.authenticate('local', function (error, user, info) {
		if (error) {
			return next(error);
		}
		if (!user) {
			return callbacks.failure(user, info);
		}
		request.logIn(user, function (error) {
			if (error) {
				return next(error);
			}
			return callbacks.success(user, info);
		});
	})(request, response, next);

};

module.exports = utils;