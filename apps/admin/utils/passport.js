module.exports = function () {	

	// Consider moving this functionality into Administrator class as static methods
	var passport = require('passport'),
		utils = {};

	// When executed the passport.authenticate looks for a 'username' and 'password' in the request object.
	// If invokes the local strategy set up in config/passport.js which checks if the credentials match in the db.
	// If an administrator is found and credentials match, the success callback is executed.
	utils.authoriseLogin = function (request, response, next, callbacks) {
		passport.authenticate('local', function (error, administrator, info) {
			if (error) {
				return next(error);
			}
			if (!administrator) {
				return callbacks.failure(administrator, info);
			}
			request.logIn(administrator, function (error) {
				if (error) {
					return next(error);
				}
				return callbacks.success(administrator, info);
			});
		})(request, response, next);

	};

	// Checks if the admin user is authenticated, then fires the relevant callback method
	utils.ensureAuthenticated = function (request, response, callbacks) {

		var isAuthorised = request.isAuthenticated();

		if (isAuthorised) {
			callbacks.success.call()
		} else {
			if (typeof callbacks.failure === 'function') {
				callbacks.failure.call();
			} else {
				request.session.originalUrl = request.originalUrl;
				request.flash('info', 'Please log in to continue.');
				response.redirect('/admin/login');
			}
		}
	}

	return utils;
}();