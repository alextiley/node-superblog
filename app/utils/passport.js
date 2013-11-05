var passport = require('passport'),
	utils = {};

// When executed the passport.authenticate looks for a 'username' and 'password' in the request object.
// If invokes the local strategy set up in config/passport.js which checks if the credentials match in the db.
// If an administrator is found and credentials match, the success callback is executed.
utils.authoriseLogin = function (request, response, next, callbacks) {
	console.log('initialising login authorisation...');
	passport.authenticate('local', function (error, administrator, info) {
		if (error) {
			console.log('Error authorising. The query for this username failed.');
			return next(error);
		}
		if (!administrator) {
			console.log('Error authorising. The administrator could not be found in the db or the password was incorrect.');
			return callbacks.failure(administrator, info);
		}
		request.logIn(administrator, function (error) {
			console.log('Attempting to log user in...');
			if (error) {
				console.log('Could not log in...');
				return next(error);
			}
			console.log('Successfully logged in.');
			return callbacks.success(administrator, info);
		});
	})(request, response, next);

};

// Checks if the admin user is authenticated, then fires the relevant callback method
utils.ensureAuthenticated = function (request, callbacks) {
	console.log('checking if user is authenticated...');
	var isAuthorised = request.isAuthenticated();
	console.log(request.isAuthenticated());
	if (isAuthorised) {
		console.log('user is already authenticated.');
		callbacks.success.call()
	} else {
		console.log('user is not authenticated.');
		callbacks.failure.call();
	}
	
}

module.exports = utils;