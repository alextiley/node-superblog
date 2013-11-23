/*
 *	Authentication middleware
 *
 *	Checks if the admin user is authenticated, then redirects to the relevant route
 */
module.exports = function (request, response, next, config) {

	var path = require('path'),
		constants = require(path.join(config.paths.shared.utils, 'constants')),
		logInUrl = /^\/(login(\/)?)?([\?|#].*)?$/,
		logOutUrl = /^\/logout(\/)?([\?|#].*)?$/;
	/*
	 *	Authenticated users: login requests should forward to dashboard
	 *	- All other requests should go to the next route in the stack
	 */
	if (request.isAuthenticated()) {
		if (request.url.match(logInUrl)) {
			return response.redirect('dashboard');
		}
		return next();
	}

	/*
	 *	Non-authenticated users: always go to the login screen
	 *	- When login request, go to the router (no need to redirect)
	 *	- On other requests, store request URL in session for redirect after login
	 *	- When logout request, bypass rule above (don't store request url in session)
	 */
	if (request.url.match(logInUrl)) {
		return next();
	} else if (!request.url.match(logOutUrl)) {
		request.session.originalUrl = request.originalUrl;
		request.flash(constants.FLASH_INFO, 'Please log in to continue.');
	}

	return response.redirect('/admin/login');
};